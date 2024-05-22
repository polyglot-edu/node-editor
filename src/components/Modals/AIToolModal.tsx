import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../data/api';
import { TypeOfExercise } from '../../types/polyglotElements';

export type ModelTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  exType: string;
  action?: (i: boolean) => void;
};

export type Topic = {
  Topic: string;
  Type: TypeOfExercise;
  Description: string;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const AIToolModal = ({
  isOpen,
  onClose,
  exType,
  action,
}: ModelTemplateProps) => {
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [titleGen, setTitle] = useState('');
  const [macroSubjectGen, setMacroSubject] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState(0);
  const [topicGen, setTopicGen] = useState<Topic[]>([
    { Topic: 'prova', Type: 0, Description: '' },
  ]);
  const [topicIndex, setTopicIndex] = useState(0);
  let exerciseType: number;
  const [noW, setNoW] = useState(200);
  const [ca_n, setCA_N] = useState(1);
  const [da_n, setDA_N] = useState(1);
  const [eda_n, setEDA_N] = useState(1);
  const [choices, setChoices] = useState<string[]>(['']);
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [screen1, setScreen1] = useState(true);
  const [screen2, setScreen2] = useState(false);
  const [screen3, setScreen3] = useState(false);
  const toast = useToast();
  const { setValue } = useFormContext();
  const word = exType == 'TrueFalseNode' ? 'Statements' : 'Answers';
  switch (exType) {
    case 'closeEndedQuestionNode':
      exerciseType = 3;
      break;
    case 'OpenQuestionNode':
      exerciseType = 0;
      break;
    case 'TrueFalseNode':
      exerciseType = 4;
      break;
    case 'multipleChoiceQuestionNode':
      exerciseType = 4;
      break;
    case 'ReadMaterialNode':
      exerciseType = 100;
      break;
    default:
      throw 'error in type';
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (action) action(false);
        onClose();
      }}
      size={'2xl'}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Do you need help to generate your learning activity?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody hidden={!screen1}>
          <Text>
            STEP 1: Submit your material in this box to use our analyser.
          </Text>
          <FormLabel mb={2} fontWeight={'bold'}>
            Your material:
          </FormLabel>
          <Textarea
            maxHeight={'200px'}
            placeholder="Insert your material here, you can put your plain text or the link (attention some websites are crypted, sometimes the tool cannot access the actual text)..."
            value={sourceMaterial}
            overflowY={'auto'}
            onChange={(e) => {
              setGeneratingLoading(false);
              setSourceMaterial(e.currentTarget.value);
            }}
          />
          <Button
            marginTop={'15px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                if (!sourceMaterial) {
                  //
                  throw ': no text given';
                }
                const response: AxiosResponse = await API.analyseMaterial({
                  material: sourceMaterial,
                });
                setTitle(response.data.Title);
                setLanguage(response.data.Language);
                setMacroSubject(response.data.MacroSubject);
                setLevel(response.data.PerceivedDifficulty);
                setTopicGen(response.data.MainTopics);
                setScreen1(false);
                setScreen2(true);
              } catch (error: any) {
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response.status) {
                  if (error.response.status == 500)
                    toast({
                      title: 'Material Error',
                      description:
                        'We are sorry, the resource is not analyzable, try with different material. Do not provide pages that are too long (e.g. Wikipedia pages) or too short, as they can not be analyzed correctly',
                      status: 'error',
                      duration: 5000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                  else if (error.response.status != 200)
                    toast({
                      title: 'AI API Error',
                      description:
                        'Internal Server error, try again. If the error persists try change material.',
                      status: 'error',
                      duration: 5000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                } else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Analyse Material
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen2}>
          <Text>STEP 2: Choose the Level and Topic you want to use.</Text>
          <FormControl label="Level">
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Level:
            </FormLabel>
            <Select
              borderColor={'grey'}
              onChange={(event) => setLevel(Number(event.currentTarget.value))}
            >
              <option value={0} defaultChecked>
                Primary School
              </option>
              <option value={1}>Middle School</option>
              <option value={2}>High School</option>
              <option value={3}>College</option>
              <option value={4}>Academy</option>
            </Select>
          </FormControl>
          <FormControl label="Topic" paddingTop={'5px'}>
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Topic:
            </FormLabel>
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setTopicIndex(Number(event.currentTarget.value))
              }
            >
              {
                <>
                  {topicGen.map((p, id) => {
                    return (
                      <option key={id} value={id}>
                        <Box width={'100px'}>{p.Topic}</Box>
                      </option>
                    );
                  })}
                </>
              }
            </Select>
          </FormControl>
          <FormLabel
            mb={2}
            fontWeight={'bold'}
            paddingTop={'5px'}
            paddingBottom={'-5px'}
          >
            Topic Description:
          </FormLabel>
          <Text>{topicGen[topicIndex].Description}</Text>
          <Button
            marginTop={'15px'}
            onClick={async () => {
              try {
                if (!topicGen) throw ': No topic generated';
                setGeneratingLoading(true);
                const response: AxiosResponse = await API.generateLO({
                  Topic: topicGen[topicIndex].Topic,
                  Level: level,
                  Context: '',
                });
                setChoices([
                  response.data.Remembering[0],
                  response.data.Remembering[1],
                  response.data.Understanding[0],
                  response.data.Understanding[1],
                  response.data.Applying[0],
                  response.data.Applying[1],
                  response.data.Analyzing[0],
                  response.data.Analyzing[1],
                  response.data.Evaluating[0],
                  response.data.Evaluating[1],
                ]);
                console.log('step2');
                console.log(choices);
                setScreen2(false);
                setScreen3(true);
              } catch (error: any) {
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response.status)
                  toast({
                    title: 'LearningObjective Error',
                    description:
                      'We are sorry, server was not able to generate the learning objective. Please, try again, if the error persists try a different topic',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Select Level and Topic
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen3}>
          <Text>
            STEP 3: Choose the learning objective you want to achieve.{' '}
          </Text>
          <FormLabel paddingTop={'5px'}>Learning Objective</FormLabel>
          <FormControl label="Topic">
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setChoiceIndex(Number(event.currentTarget.value))
              }
            >
              {
                <>
                  {choices.map((p, id) => (
                    <option key={id} value={id}>
                      <p>{p}</p>
                    </option>
                  ))}
                </>
              }
            </Select>
          </FormControl>
          <Flex hidden={exerciseType != 8}></Flex>
          <Flex
            paddingTop={'5px'}
            alignItems={'center'}
            hidden={exerciseType != 4 && exerciseType != 2}
          >
            N° Correct {word}:
            <NumberInput
              float={'right'}
              defaultValue={ca_n}
              min={1}
              max={1}
              width={'80px'}
              title="soon: multiple correct answer"
            >
              <NumberInputField />
              {/*
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setCA_N(ca_n + 1)} />
                <NumberDecrementStepper onClick={() => setCA_N(ca_n - 1)} />
              </NumberInputStepper>
              */}
            </NumberInput>
            N° Wrong {word}:
            <NumberInput defaultValue={da_n} min={0} max={6} width={'80px'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setDA_N(da_n + 1)} />
                <NumberDecrementStepper onClick={() => setDA_N(da_n - 1)} />
              </NumberInputStepper>
            </NumberInput>
            N° Easy Wrong {word}:
            <NumberInput defaultValue={eda_n} min={0} max={6} width={'80px'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setEDA_N(eda_n + 1)} />
                <NumberDecrementStepper onClick={() => setEDA_N(eda_n - 1)} />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
          <Button
            hidden={exerciseType == 100}
            marginTop={'15px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                if (!topicGen) throw ': no topic generated';
                const response: AxiosResponse = await API.generateNewExercise({
                  macroSubject: macroSubjectGen,
                  title: titleGen,
                  level: level, //0=primary_school, 1=middle_school, 2=high_school, 3=college, 4=academy
                  typeOfActivity: exerciseType, //0=fill_the_gap, 1=question, 4=choice,
                  learningObjective: choices[choiceIndex],
                  bloomLevel: Math.round(choiceIndex / 2), //0=Remembering, 1=Understanding, 2=Applying, 3=Analyzing, 4=Evaluating, 5=Creating
                  language: language,
                  material: sourceMaterial,
                  correctAnswersNumber: ca_n,
                  distractorsNumber: da_n,
                  easilyDiscardableDistractorsNumber: eda_n,
                  assignmentType: topicGen[topicIndex].Type, //0=theoretical, 1=code, 2=problem_resolution,
                  topic: topicGen[topicIndex].Topic,
                  temperature: 0.2,
                });
                console.log(response.data);
                let dataGen;
                switch (exerciseType) {
                  case 0:
                    console.log('creating openQuestion');
                    dataGen = {
                      question: response.data.Assignment,
                      material: sourceMaterial,
                      aiQuestion: false,
                      possibleAnswer: response.data.Solutions[0],
                    };
                    break; /*
                  case 2:
                    console.log('creating trueFalse');
                    dataGen = {
                      question: response.data.Assignment,
                      material: sourceMaterial,
                      aiQuestion: false,
                      possibleAnswer: response.data.Solutions[0],
                    };
                    break;
                  */
                  case 3:
                    console.log('creating close_ended_question');
                    dataGen = {
                      question:
                        response.data.Assignment + '\n' + response.data.Plus,
                      correctAnswers: response.data.Solutions,
                    };
                    break;
                  case 4:
                    console.log('creating multichoice');
                    const answers = [].concat(
                      response.data.Solutions,
                      response.data.Distractors.splice(0, da_n),
                      response.data.EasilyDiscardableDistractors.splice(
                        0,
                        eda_n
                      )
                    );
                    answers.sort(() => Math.random() - 0.5);

                    const isAnswerCorrect = new Array(answers.length).fill(
                      false
                    );
                    answers.forEach((value, index) => {
                      if (response.data.Solutions.includes(value))
                        isAnswerCorrect[index] = true;
                    });
                    if (exType == 'TrueFalseNode')
                      dataGen = {
                        instructions: 'Argument: ' + response.data.Assignment,
                        questions: answers,
                        isQuestionCorrect: isAnswerCorrect,
                      };
                    else
                      dataGen = {
                        question: response.data.Assignment,
                        choices: answers,
                        isChoiceCorrect: isAnswerCorrect,
                      };
                    if (
                      !response.data.Distractors[0] &&
                      !response.data.EasilyDiscardableDistractors[0]
                    ) {
                      toast({
                        title: 'Generating Error',
                        description:
                          'The AI was not able to generate a complete multichoice exercise, we suggest to generate an Open Question or a Close Ended Question for this topic',
                        status: 'warning',
                        duration: 4000,
                        position: 'bottom-left',
                        isClosable: false,
                      });
                      await delay(3000);
                    }
                    break;
                  default:
                    console.log('error in exerciseType');
                    throw ': generated type error';
                }
                setScreen1(true);
                setScreen3(false);
                console.log(dataGen);
                setValue('data', dataGen);
                if (action) action(false);
                onClose();
              } catch (error: any) {
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response.status)
                  toast({
                    title: 'Exercise Error',
                    description:
                      'We are sorry, server was not able to generate the exercise. Please, try again, if the error persists, you should restart.',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Generate Learning Activity
          </Button>
          <Button
            hidden={exerciseType != 100}
            marginTop={'15px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                if (!topicGen) throw ': no topic generated';
                const response: AxiosResponse = await API.generateMaterial({
                  numberOfWords: noW,
                  level: level, //0=primary_school, 1=middle_school, 2=high_school, 3=college, 4=academy
                  learningObjective: choices[choiceIndex],
                  topic: topicGen[topicIndex].Topic,
                });
                setScreen1(true);
                setScreen3(false);
                console.log(response.data);
                let dataGen;
                switch (exerciseType) {
                  case 100:
                    console.log('creating readMaterial');
                    dataGen = {
                      text: response.data,
                      link: '',
                    };
                    break;
                  default:
                    console.log('error in exerciseType');
                    throw ': generated type error';
                }
                console.log(dataGen);
                setValue('data', dataGen);
                if (action) action(false);
                onClose();
              } catch (error: any) {
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response.status)
                  toast({
                    title: 'Generation Error',
                    description:
                      'We are sorry, server was not able to generate the material. Please, try again, if the error persists, you should restart.',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Generate Material
          </Button>
        </ModalBody>
        <Button
          onClick={() => {
            setScreen1(true);
            setScreen2(false);
            setScreen3(false);
            setSourceMaterial('');
          }}
          width={'80px'}
          bottom={'12'}
          alignSelf={'center'}
        >
          Restart
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default AIToolModal;
