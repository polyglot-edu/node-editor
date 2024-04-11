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
import { v4 as UUIDv4 } from 'uuid';
import { API } from '../../data/api';
import useStore from '../../store';
import { PolyglotNode, TypeOfExercise } from '../../types/polyglotElements';

export type ModelTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type Topic = {
  Topic: string;
  Type: TypeOfExercise;
  Description: string;
};

const AIToolModal = ({ isOpen, onClose }: ModelTemplateProps) => {
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [context, setContext] = useState('');
  const [titleGen, setTitle] = useState('');
  const [macroSubjectGen, setMacroSubject] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState(0);
  const [topicGen, setTopicGen] = useState<Topic[]>([
    { Topic: 'prova', Type: 0, Description: '' },
  ]);
  const [topicIndex, setTopicIndex] = useState(0);
  const [exerciseType, setExerciseType] = useState(1);
  const [ca_n, setCA_N] = useState(0);
  const [da_n, setDA_N] = useState(0);
  const [eda_n, setEDA_N] = useState(0);
  const toast = useToast();
  const [choices, setChoices] = useState<string[]>(['']);
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [screen1, setScreen1] = useState(true);
  const [screen2, setScreen2] = useState(false);
  const [screen3, setScreen3] = useState(false);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Do you need help to generate your material?</ModalHeader>
        <ModalCloseButton />
        <ModalBody hidden={!screen1}>
          <Text>
            STEP 1: Submit your material in this box to use our analyser.
          </Text>
          <Button
            marginBottom={'5px'}
            marginTop={'5px'}
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
                console.log(topicGen);
                setScreen1(false);
                setScreen2(true);
                setGeneratingLoading(false);
              } catch (error) {
                setGeneratingLoading(false);
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
                toast({
                  title: 'Internal Error',
                  description: 'Try later' + (error as Error),
                  status: 'error',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
              }
            }}
            isLoading={generatingLoading}
          >
            Analyse Material
          </Button>
          <FormLabel mb={2} fontWeight={'bold'}>
            Your material:
          </FormLabel>
          <Textarea
            maxHeight={'200px'}
            placeholder="Insert your material here..."
            value={sourceMaterial}
            overflowY={'auto'}
            onChange={(e) => {
              setGeneratingLoading(false);
              setSourceMaterial(e.currentTarget.value);
            }}
          />
        </ModalBody>
        <ModalBody hidden={!screen2}>
          <Text>STEP 2: Choose the topic you want to submit.</Text>
          <Button
            marginBottom={'5px'}
            marginTop={'5px'}
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
                setGeneratingLoading(false);
              } catch (error) {
                setGeneratingLoading(false);
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
                toast({
                  title: 'Internal Error',
                  description: 'Try later' + (error as Error),
                  status: 'error',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
              }
            }}
            isLoading={generatingLoading}
          >
            Submit Topic
          </Button>
          <FormControl label="Level">
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
                        <Box width={'100px'}>Topic: {p.Topic}</Box>
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
          <FormLabel mb={2} fontWeight={'bold'}>
            Additional Context:
          </FormLabel>
          <Textarea
            placeholder="Insert additional information about your target (optional)"
            maxHeight={'200px'}
            value={context}
            onChange={(e) => setContext(e.currentTarget.value)}
          />
        </ModalBody>
        <ModalBody hidden={!screen3}>
          <Text>STEP 3: Choose the exercise you want to generate.</Text>
          <Button
            marginBottom={'5px'}
            marginTop={'5px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                if (!topicGen) throw ': no topic generated';
                const response: AxiosResponse = await API.generateNewExercise({
                  macroSubject: macroSubjectGen,
                  title: titleGen,
                  level: level, //0=primary_school, 1=middle_school, 2=high_school, 3=college, 4=academy
                  typeOfExercise: exerciseType, // 1=question, 4=choice,
                  learningObjective: choices[choiceIndex][0],
                  bloomLevel: choiceIndex / 2, //0=Remembering, 1=Understanding, 2=Applying, 3=Analyzing, 4=Evaluating, 5=Creating
                  language: language,
                  material: sourceMaterial,
                  correctAnswersNumber: ca_n,
                  distractorsNumber: da_n,
                  easilyDiscardableDistractorsNumber: eda_n,
                  assignmentType: topicGen[topicIndex].Type, //0=theoretical, 1=code, 2=problem_resolution,
                  topic: topicGen[topicIndex].Topic,
                  temperature: 0.2,
                });
                setScreen1(true);
                setScreen3(false);
                setGeneratingLoading(false);
                console.log(response.data);
                const id = UUIDv4();
                let dataGen;
                let exType = '';
                switch (exerciseType) {
                  case 1:
                    console.log('creating openQuestion');
                    exType = 'OpenQuestionNode';
                    dataGen = {
                      question: response.data.Assignment,
                      material: sourceMaterial,
                      aiQuestion: false,
                      possibleAnswer: response.data.Solutions[0],
                    };
                    break;
                  case 4:
                    console.log('creating multichoice');
                    const answers = [].concat(
                      response.data.Solutions,
                      response.data.Distractors,
                      response.data.EasilyDiscardableDistractors
                    ); //response.data.
                    answers.sort(() => Math.random() - 0.5);
                    console.log(answers);
                    const isAnswerCorrect = new Array(answers.length).fill(
                      false
                    );
                    answers.forEach((value, index) => {
                      if (response.data.Solutions.includes(value))
                        isAnswerCorrect[index] = true;
                    });
                    exType = 'multipleChoiceQuestionNode';
                    dataGen = {
                      question: response.data.question,
                      choices: answers,
                      isChoiceCorrect: isAnswerCorrect,
                      aiQuestion: false,
                      solution: '',
                      language: '',
                      text: '',
                      level: '',
                      questionCategory: '',
                      n_o_ca: '',
                      nedd: '',
                      n_o_d: '',
                    };
                    break;
                  default:
                    console.log('error in exerciseType');
                    throw ': generated type error';
                }

                const exerciseGiven: PolyglotNode = {
                  _id: id,
                  type: exType,
                  title: titleGen,
                  description: topicGen[topicIndex].Description,
                  difficulty: 1,
                  data: dataGen,
                  reactFlow: {
                    id: id,
                    type: exType,
                    position: {
                      x: 200,
                      y: 200,
                    },
                    data: undefined,
                  },
                };

                useStore.getState().addNode(exerciseGiven);                
                onClose();
              } catch (error) {
                setGeneratingLoading(false);
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
                toast({
                  title: 'Internal Error',
                  description: 'Try later' + (error as Error),
                  status: 'error',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
              }
            }}
            isLoading={generatingLoading}
          >
            Generate Exercise
          </Button>
          <FormLabel paddingTop={'5px'}>Topic</FormLabel>
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
          <FormLabel paddingTop={'5px'}>Exercise Type</FormLabel>
          <FormControl>
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setExerciseType(Number(event.currentTarget.value))
              }
            >
              <option value={1} defaultChecked>
                Open question
              </option>
              <option value={4}>Multichoice</option>
            </Select>
          </FormControl>
          <Flex
            paddingTop={'5px'}
            alignItems={'center'}
            hidden={exerciseType == 1}
          >
            N° Correct Answers:
            <NumberInput float={'right'} defaultValue={1} min={1} max={6}>
              <NumberInputField
                width={'80px'}
                onChange={(e) => setCA_N(Number(e.currentTarget.value))}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            N° Distractors:
            <NumberInput defaultValue={1} min={1} max={6} width={'80px'}>
              <NumberInputField
                onChange={(e) => setDA_N(Number(e.currentTarget.value))}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            N° Easy Distractors:
            <NumberInput defaultValue={1} min={1} max={6} width={'80px'}>
              <NumberInputField
                onChange={(e) => setEDA_N(Number(e.currentTarget.value))}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
          <FormLabel mb={2} fontWeight={'bold'}>
            Stuff:
          </FormLabel>
          <Textarea placeholder="stuff" maxHeight={'200px'} value={context} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AIToolModal;
