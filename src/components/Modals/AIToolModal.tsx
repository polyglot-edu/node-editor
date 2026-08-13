import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
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
import { EXAMPLE_ANALYZED_MATERIAL } from '../../data/exampleAnalyzedMaterial';
import {
  AIExerciseGenerated,
  AIMaterialGenerated,
  AIMaterialType,
  EducationLevel,
  LearningOutcome,
  QuestionTypeMap,
  Topic,
} from '../../types/polyglotElements/AIGenerativeTypes/AIGenerativeTypes';
import InfoButton from '../UtilityComponents/InfoButton';
import ModelAPIKey from './ModelAPIKeySelector';

export type ModaTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  exType: string;
  action?: (i: boolean) => void;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffleArray<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// exerciseTypeKey values (see QuestionTypeMap / the 'ReadMaterial' fallback)
// the free default model is allowed to generate. Everything else requires
// the user to bring their own model + API key.
const DEFAULT_MODEL_ALLOWED_TYPES = [
  'ReadMaterial',
  'multiple choice',
  'short answer question',
];

const isAllowedForModel = (exerciseTypeKey: string, model: string) =>
  model !== 'default' || DEFAULT_MODEL_ALLOWED_TYPES.includes(exerciseTypeKey);

const AIToolModal = ({
  isOpen,
  onClose,
  exType,
  action,
}: ModaTemplateProps) => {
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [titleGen, setTitle] = useState('');
  const [macroSubjectGen, setMacroSubject] = useState('');
  const [learningOutcome, setLearningOutcome] = useState<LearningOutcome>();
  const [choosingLearningOutcome, setChoosingLearningOutcome] =
    useState<LearningOutcome>();
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState(0);
  const [eduLevel, setEduLevel] = useState<EducationLevel>();
  const [topicGen, setTopicGen] = useState<Topic[]>([
    { topic: 'prova', explanation: '' },
  ]);

  const [model, setModel] = useState('');
  const [llm_token, setLLMToken] = useState('');

  const [manualMode, setManualMode] = useState(false);

  const [topicIndex, setTopicIndex] = useState(0);
  let exerciseTypeKey = QuestionTypeMap.find(
    (elem) => elem.nodeType == exType
  )?.key;
  if (!exerciseTypeKey) exerciseTypeKey = 'ReadMaterial';
  const [ca_n, setCA_N] = useState(1);
  const [da_n, setDA_N] = useState(1);
  const [eda_n, setEDA_N] = useState(1);
  const [screen1, setScreen1] = useState(true);
  const [screen2, setScreen2] = useState(false);
  const [screen3, setScreen3] = useState(false);
  const toast = useToast();
  const { setValue } = useFormContext();
  const word = exType == 'TrueFalseNode' ? 'Statements' : 'Answers';
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
          <ModelAPIKey
            model={model}
            setModel={setModel}
            llm_token={llm_token}
            setLlm_token={setLLMToken}
          />
          <Text>
            STEP 1: Submit your material in this box to use our analyser.
          </Text>
          <FormLabel mb={2} fontWeight={'bold'}>
            Your material:
            <InfoButton
              title="Material to Analyze"
              description="Provide the source content you want the learning path to be built upon. This could be a text, article, lesson plan, or any other educational material."
              placement="right"
            />
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
            isDisabled={!model || (model !== 'default' && llm_token.length == 0)}
            marginTop={'15px'}
            onClick={async () => {
              if (!isAllowedForModel(exerciseTypeKey as string, model)) {
                toast({
                  title: 'Premium feature',
                  description: "This feature isn't allowed with the default model.",
                  status: 'warning',
                  duration: 4000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                return;
              }
              try {
                setGeneratingLoading(true);
                setManualMode(false);
                if (!sourceMaterial) {
                  //
                  throw ': no text given';
                }
                const response: AxiosResponse = await API.analyseMaterial({
                  url: sourceMaterial,
                  model: model,
                  llm_token: llm_token,
                });
                console.log(response);
                setTitle(response.data.title);
                setLanguage(response.data.language);
                setMacroSubject(response.data.macro_subject);
                setLearningOutcome(
                  response.data.learning_outcome as LearningOutcome
                );
                setChoosingLearningOutcome(
                  response.data.learning_outcome as LearningOutcome
                );
                setEduLevel(response.data.education_level as EducationLevel);
                setLanguage(response.data.language);
                setDuration(response.data.estimated_duration);
                setTopicGen(response.data.topics);
                setScreen1(false);
                setScreen2(true);
              } catch (error: any) {
                console.log(error);
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
                if (error.response)
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
          <Button
            isDisabled={!model || (model !== 'default' && llm_token.length == 0)}
            marginTop={'15px'}
            marginLeft={'10px'}
            onClick={() => {
              if (!isAllowedForModel(exerciseTypeKey as string, model)) {
                toast({
                  title: 'Premium feature',
                  description: "This feature isn't allowed with the default model.",
                  status: 'warning',
                  duration: 4000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                return;
              }
              setManualMode(true);
              setTitle('');
              setMacroSubject('');
              setLearningOutcome('' as LearningOutcome);
              setChoosingLearningOutcome('' as LearningOutcome);
              setEduLevel({} as EducationLevel);
              setLanguage('english');
              setDuration(20);
              setTopicGen([{ topic: '', explanation: '' }] as Topic[]);
              setScreen1(false);
              setScreen2(true);
            }}
          >
            Skip step
          </Button>
          <Button
            isDisabled={!model || (model !== 'default' && llm_token.length == 0)}
            marginTop={'15px'}
            marginLeft={'10px'}
            variant={'outline'}
            colorScheme={'teal'}
            onClick={() => {
              if (!isAllowedForModel(exerciseTypeKey as string, model)) {
                toast({
                  title: 'Premium feature',
                  description: "This feature isn't allowed with the default model.",
                  status: 'warning',
                  duration: 4000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                return;
              }
              setManualMode(true);
              setTitle(EXAMPLE_ANALYZED_MATERIAL.title);
              setMacroSubject(EXAMPLE_ANALYZED_MATERIAL.macro_subject);
              setLearningOutcome(EXAMPLE_ANALYZED_MATERIAL.learning_outcome);
              setChoosingLearningOutcome(
                EXAMPLE_ANALYZED_MATERIAL.learning_outcome
              );
              setEduLevel(EXAMPLE_ANALYZED_MATERIAL.education_level);
              setLanguage(EXAMPLE_ANALYZED_MATERIAL.language);
              setDuration(EXAMPLE_ANALYZED_MATERIAL.estimated_duration);
              setTopicGen(EXAMPLE_ANALYZED_MATERIAL.topics);
              setScreen1(false);
              setScreen2(true);
            }}
          >
            Insert example
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen2}>
          <Text>
            {!manualMode
              ? 'STEP 2: Choose the Level and Topic you want to use.'
              : 'STEP 2: Define the characteristics of the learning activity.'}
          </Text>
          <FormControl label="Level">
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Educational Level:
              <InfoButton
                title="Educational Level"
                description="Specify the academic level of the target audience, such as elementary school, high school, or college, to tailor the learning path appropriately."
                placement="right"
              />
            </FormLabel>
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setEduLevel(event.currentTarget.value as EducationLevel)
              }
            >
              {Object.values(EducationLevel).map((level) => (
                <option key={level} value={level} selected={eduLevel === level}>
                  {level}
                </option>
              ))}
            </Select>
          </FormControl>

          {manualMode ? (
            <>
              <FormControl paddingTop={'5px'}>
                <FormLabel
                  mb={2}
                  fontWeight={'bold'}
                  paddingTop={'5px'}
                  paddingBottom={'-5px'}
                >
                  Title:
                  <InfoButton
                    title="Title"
                    description="Give the learning activity a title, it will be used to label the generated content."
                    placement="right"
                  />
                </FormLabel>
                <Input
                  borderColor={'grey'}
                  placeholder="Insert a title for the learning activity..."
                  value={titleGen}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel
                  mb={2}
                  fontWeight={'bold'}
                  paddingTop={'5px'}
                  paddingBottom={'-5px'}
                >
                  Macro Subject:
                  <InfoButton
                    title="Macro Subject"
                    description="The general subject area the activity belongs to, e.g. 'Biology' or 'European History'."
                    placement="right"
                  />
                </FormLabel>
                <Input
                  borderColor={'grey'}
                  placeholder="Insert the macro subject..."
                  value={macroSubjectGen}
                  onChange={(e) => setMacroSubject(e.currentTarget.value)}
                />
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel
                  mb={2}
                  fontWeight={'bold'}
                  paddingTop={'5px'}
                  paddingBottom={'-5px'}
                >
                  Topic:
                </FormLabel>
                <Textarea
                  maxHeight={'200px'}
                  placeholder="Insert the topic for the learning activity..."
                  value={topicGen[0].topic}
                  overflowY={'auto'}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setTopicGen((prev) => {
                      const updated = [...prev];
                      updated[0] = { ...updated[0], topic: value };
                      return updated;
                    });
                  }}
                />
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel
                  mb={2}
                  fontWeight={'bold'}
                  paddingTop={'5px'}
                  paddingBottom={'-5px'}
                >
                  Topic Description:
                </FormLabel>
                <Textarea
                  maxHeight={'200px'}
                  placeholder="Insert the description for the learning activity..."
                  value={topicGen[0].explanation}
                  overflowY={'auto'}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setTopicGen((prev) => {
                      const updated = [...prev];
                      updated[0] = { ...updated[0], explanation: value };
                      return updated;
                    });
                  }}
                />
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel
                  mb={2}
                  fontWeight={'bold'}
                  paddingTop={'5px'}
                  paddingBottom={'-5px'}
                >
                  Language:
                  <InfoButton
                    title="Language"
                    description="The language the learning activity should be generated in."
                    placement="right"
                  />
                </FormLabel>
                <Input
                  borderColor={'grey'}
                  placeholder="e.g. english"
                  value={language}
                  onChange={(e) => setLanguage(e.currentTarget.value)}
                />
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel
                  mb={2}
                  fontWeight={'bold'}
                  paddingTop={'5px'}
                  paddingBottom={'-5px'}
                >
                  Estimated Duration (minutes):
                </FormLabel>
                <NumberInput defaultValue={duration} min={1} width={'100px'}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      onClick={() => setDuration(duration + 1)}
                    />
                    <NumberDecrementStepper
                      onClick={() => setDuration(duration - 1)}
                    />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Button
                marginTop={'15px'}
                onClick={async () => {
                  try {
                    if (!topicGen) throw new Error('No topic generated');
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
                    if (error.response?.status)
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
                Confirm Manual Input
              </Button>
            </>
          ) : (
            topicGen &&
            topicGen.length > 0 && (
              <>
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
                    {topicGen.map((p, id) => (
                      <option key={id} value={id}>
                        {p.topic}
                      </option>
                    ))}
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
                <Text>{topicGen[topicIndex]?.explanation}</Text>

                <Button
                  marginTop={'15px'}
                  onClick={async () => {
                    try {
                      if (!topicGen) throw new Error('No topic generated');
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
                      if (error.response?.status)
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
                  Select Educational Level and Topic
                </Button>
              </>
            )
          )}
        </ModalBody>
        <ModalBody hidden={!screen3}>
          <Text>STEP 3: Define the specifics for the activity.</Text>
          <FormLabel paddingTop={'5px'}>
            Learning Objective
            <InfoButton
              title="Learning Outcome"
              description="Describe the intended educational goal of the learning path. For example: 'the ability to recall or recognize simple facts and definitions.'"
              placement="right"
            />
          </FormLabel>
          <FormControl label="Learning Outcome">
            <Select
              value={choosingLearningOutcome}
              borderColor="grey"
              onChange={(event) =>
                setChoosingLearningOutcome(
                  event.currentTarget.value as LearningOutcome
                )
              }
            >
              {Object.entries(LearningOutcome).map(([key, value]) => (
                <option key={key} value={value}>
                  {learningOutcome === value ? '*' : ''}
                  {value}
                  {learningOutcome === value ? '*' : ''}
                </option>
              ))}
            </Select>
          </FormControl>
          <Flex
            paddingTop={'5px'}
            alignItems={'center'}
            hidden={
              exerciseTypeKey != 'true or false' &&
              exerciseTypeKey != 'multiple choice'
            }
          >
            N° Correct {word}:
            <NumberInput
              float={'right'}
              defaultValue={ca_n}
              min={1}
              width={'80px'}
              title="soon: multiple correct answer"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setCA_N(ca_n + 1)} />
                <NumberDecrementStepper onClick={() => setCA_N(ca_n - 1)} />
              </NumberInputStepper>
            </NumberInput>
            N° Wrong {word}:
            <NumberInput defaultValue={da_n} min={0} max={6} width={'80px'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setDA_N(da_n + 1)} />
                <NumberDecrementStepper onClick={() => setDA_N(da_n - 1)} />
              </NumberInputStepper>
            </NumberInput>
            N° Easy Discardable {word}:
            <NumberInput defaultValue={eda_n} min={0} max={6} width={'80px'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setEDA_N(eda_n + 1)} />
                <NumberDecrementStepper onClick={() => setEDA_N(eda_n - 1)} />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
          <Button
            hidden={exerciseTypeKey == 'ReadMaterial'}
            marginTop={'15px'}
            onClick={async () => {
              if (!isAllowedForModel(exerciseTypeKey as string, model)) {
                toast({
                  title: 'Premium feature',
                  description: "This feature isn't allowed with the default model.",
                  status: 'warning',
                  duration: 4000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                return;
              }
              try {
                setGeneratingLoading(true);
                setLearningOutcome(choosingLearningOutcome);
                if (!topicGen) throw ': no topic generated';
                if (eduLevel == undefined || learningOutcome == undefined)
                  throw ': error in eduLevel and learningOutcome';
                if (exerciseTypeKey != 'ReadMaterialNode') {
                  const response: AxiosResponse = await API.generateNewExercise(
                    {
                      macro_subject: macroSubjectGen,
                      topic: topicGen[topicIndex].topic,
                      topic_explanation: topicGen[topicIndex].explanation,
                      education_level: eduLevel,
                      learning_outcome: learningOutcome,
                      material: sourceMaterial,
                      params: [
                        {
                          solutions_number: ca_n,
                          distractors_number: da_n,
                          easily_discardable_distractors_number: eda_n,
                          type: exerciseTypeKey as string,
                        },
                      ],
                      language: language,
                      model: model,
                      llm_token: llm_token,
                    }
                  );
                  console.log(response.data);
                  const dataGen: AIExerciseGenerated = response.data;
                  let adaptedData;
                  switch (exerciseTypeKey) {
                    case 'open question':
                      adaptedData = {
                        question: dataGen.assignment,
                        material: dataGen.material,
                        aiQuestion: false,
                        possibleAnswer: dataGen.solutions[0],
                      };
                      break;
                    case 'short answer question':
                      adaptedData = {
                        question: dataGen.assignment + ' ' + dataGen.plus,
                        correctAnswers: dataGen.solutions,
                      };
                      break;
                    case 'multiple choice':
                      const answers = [
                        ...dataGen.solutions.slice(0, ca_n),
                        ...dataGen.distractors.slice(0, da_n),
                        ...dataGen.easily_discardable_distractors.slice(
                          0,
                          eda_n
                        ),
                      ].filter((statement) => statement !== 'empty');
                      const shuffleAnswers = shuffleArray(answers);

                      const isAnswerCorrect = new Array(
                        shuffleAnswers.length
                      ).fill(false);
                      shuffleAnswers.forEach((value, index) => {
                        if (dataGen.solutions.includes(value))
                          isAnswerCorrect[index] = true;
                      });
                      adaptedData = {
                        question: dataGen.assignment,
                        choices: shuffleAnswers,
                        isChoiceCorrect: isAnswerCorrect,
                      };
                      if (
                        !dataGen.distractors[0] &&
                        !dataGen.easily_discardable_distractors[0]
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
                    case 'true or false':
                      console.log('creating true or false');
                      const solutions = dataGen.solutions.map((s) => {
                        const splitIndex = s.indexOf('. ');
                        return splitIndex !== -1 ? s.slice(splitIndex + 2) : s;
                      });
                      const statements = [
                        ...solutions.slice(0, ca_n),
                        ...dataGen.distractors.slice(0, da_n),
                        ...dataGen.easily_discardable_distractors.slice(
                          0,
                          eda_n
                        ),
                      ].filter((statement) => statement !== 'empty');
                      const shuffleTFAnswers = shuffleArray(statements);
                      const isStatementCorrect = new Array(
                        shuffleTFAnswers.length
                      ).fill(false);
                      shuffleTFAnswers.map((value, index) => {
                        console.log(index);
                        if (dataGen.solutions.includes(value))
                          isStatementCorrect[index] = true;
                      });
                      adaptedData = {
                        instructions: 'Argument: ' + dataGen.assignment,
                        questions: shuffleTFAnswers,
                        isQuestionCorrect: isStatementCorrect,
                      };
                      if (
                        !dataGen.distractors[0] &&
                        !dataGen.easily_discardable_distractors[0]
                      ) {
                        toast({
                          title: 'Generating Error',
                          description:
                            'The AI was not able to generate a complete true or false exercise, we suggest to generate an Open Question or a Close Ended Question for this topic',
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
                  console.log(adaptedData);
                  setValue('data', adaptedData);
                  setValue('title', titleGen);
                }
                setScreen1(true);
                setScreen3(false);
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
            hidden={exerciseTypeKey != 'ReadMaterial'}
            marginTop={'15px'}
            onClick={async () => {
              try {
                if (exerciseTypeKey != 'ReadMaterial') return;
                if (eduLevel == undefined || learningOutcome == undefined)
                  throw ': error in eduLevel and learningOutcome';
                setGeneratingLoading(true);
                if (!topicGen) throw ': no topic generated';
                const response: AxiosResponse = await API.generateMaterial({
                  title: titleGen,
                  macro_subject: macroSubjectGen,
                  topics: [
                    {
                      topics: topicGen,
                      title: '',
                      learning_outcome: learningOutcome,
                    },
                  ],
                  education_level: eduLevel,
                  learning_outcome: learningOutcome,
                  duration: duration,
                  language: language,
                  type_of_file: 'md',
                  model: model,
                  llm_token: llm_token,
                } as AIMaterialType);

                setScreen1(true);
                setScreen3(false);

                if (!response) throw 'Error generate';

                console.log(response.data);

                const dataGen: AIMaterialGenerated = {
                  type_of_file: 'md',
                  content: response.data,
                };

                let adaptedData;

                switch (exerciseTypeKey) {
                  case 'ReadMaterial':
                    console.log('creating readMaterial');
                    adaptedData = {
                      text: dataGen.content,
                      link: '',
                    };
                    break;
                  default:
                    console.log('error in exerciseType');
                    throw ': generated type error';
                }
                console.log(adaptedData);
                setValue('data', adaptedData);
                setValue('title', titleGen);
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
            setTitle('');
            setMacroSubject('');
            setLearningOutcome('' as LearningOutcome);
            setManualMode(false);
            setChoosingLearningOutcome('' as LearningOutcome);
            setEduLevel({} as EducationLevel);
            setLanguage('english');
            setDuration(20);
            setTopicGen([{ topic: '', explanation: '' }] as Topic[]);
          }}
          width={'80px'}
          bottom={'12'}
          alignSelf={'flex-end'}
          right={'12'}
        >
          Restart
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default AIToolModal;
