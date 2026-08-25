import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import { API } from '../../data/api';
import { EXAMPLE_ANALYZED_MATERIAL } from '../../data/exampleAnalyzedMaterial';
import {
  PolyglotEdge,
  PolyglotFlow,
  PolyglotNode,
} from '../../types/polyglotElements';
import {
  AIExerciseGenerated,
  AIMaterialGenerated,
  AIMaterialType,
  AIPlanLessonResponse,
  AnalyzedMaterial,
  EducationLevel,
  LearningOutcome,
  LessonNodeAI,
  PlanLessonNode,
  QuestionTypeMap,
  Topic,
} from '../../types/polyglotElements/AIGenerativeTypes/AIGenerativeTypes';
import PlanLessonCard from '../Card/PlanLessonCard';
import { getApiErrorMessage } from '../../utils/apiError';
import InfoButton from '../UtilityComponents/InfoButton';
import ProgressBar from '../UtilityComponents/ProgressBar';
import ModelAPIKey from './ModelAPIKeySelector';

export type ModaTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
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

const dataFactory: Record<string, (values: AIExerciseGenerated) => any> = {
  OpenQuestionNode: (values) => ({
    question: values.assignment,
    material: values.material,
    aiQuestion: false,
    possibleAnswer: values.solutions[0],
  }),
  closeEndedQuestionNode: (values) => ({
    question: values.assignment + ' ' + values.plus,
    correctAnswers: values.solutions,
    isAnswerCorrect: [],
  }),
  TrueFalseNode: (values) => {
    const solutions = values.solutions.map((s) => {
      const splitIndex = s.indexOf('. ');
      return splitIndex !== -1 ? s.slice(splitIndex + 2) : s;
    });
    const answers = [
      ...solutions,
      ...values.distractors,
      ...values.easily_discardable_distractors,
    ].filter((statement) => statement !== 'empty');
    const shuffleAnswers = shuffleArray(answers);

    const isAnswerCorrect = new Array(shuffleAnswers.length).fill(false);
    shuffleAnswers.forEach((value, index) => {
      if (values.solutions.includes(value)) isAnswerCorrect[index] = true;
    });
    return {
      instructions: values.assignment,
      questions: shuffleAnswers,
      isQuestionCorrect: isAnswerCorrect,
    };
  },
  multipleChoiceQuestionNode: (values) => {
    const answers = [
      ...values.solutions,
      ...values.distractors,
      ...values.easily_discardable_distractors,
    ].filter((statement) => statement !== 'empty');
    const shuffleAnswers = shuffleArray(answers);

    const isAnswerCorrect = new Array(shuffleAnswers.length).fill(false);
    shuffleAnswers.forEach((value, index) => {
      if (values.solutions.includes(value)) isAnswerCorrect[index] = true;
    });
    return {
      question: values.assignment,
      choices: shuffleAnswers,
      isChoiceCorrect: isAnswerCorrect,
    };
  },
};

const CreateAILPModal = ({ isOpen, onClose, action }: ModaTemplateProps) => {
  const [analysedMaterial, setAnalyzedMaterial] = useState<AnalyzedMaterial>();
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [context, setContext] = useState('');
  const [AINodes, setAINodes] = useState<AIPlanLessonResponse>();
  const [selectedNodes, setSelectedNodes] = useState<AIPlanLessonResponse>();
  const [learningOutcome, setLearningOutcome] = useState<LearningOutcome>();
  const [eduLevel, setEduLevel] = useState<EducationLevel>();
  const [selectedTopic, setSelectedTopic] = useState<Topic[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [nReadMaterial, setNReadMaterial] = useState(1);
  const [stepGeneration, setStepGeneration] = useState(0);
  const [screen1, setScreen1] = useState(true);
  const [screen2, setScreen2] = useState(false);
  const [screen3, setScreen3] = useState(false);
  const generatedNodes: PolyglotNode[] = [];

  const [model, setModel] = useState('');
  const [llm_token, setLLMToken] = useState('');

  const [manualMode, setManualMode] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualMacroSubject, setManualMacroSubject] = useState('');
  const [manualLanguage, setManualLanguage] = useState('english');
  const [manualDuration, setManualDuration] = useState(20);
  const [manualTopics, setManualTopics] = useState<Topic[]>([
    { topic: '', explanation: '' },
  ]);
  const [manualKeywords, setManualKeywords] = useState<string[]>([
    '',
    '',
    '',
    '',
  ]);

  const router = useRouter();

  useEffect(() => {
    if (analysedMaterial) {
      setScreen1(false);
      setScreen2(true);
    }
  }, [analysedMaterial]);

  useEffect(() => {
    if (AINodes) {
      setScreen2(false);
      setScreen3(true);
    }
  }, [AINodes]);

  //functions for topic handler
  const toggleTopic = (topic: Topic) => {
    setSelectedTopic((prev) => {
      const exists = prev.some((t) => t.topic === topic.topic);
      return exists
        ? prev.filter((t) => t.topic !== topic.topic)
        : [...prev, topic];
    });
  };

  const isTopicSelected = (topic: Topic) =>
    selectedTopic.some((t) => t.topic === topic.topic);
  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  //functions for the manual topics editor
  const updateManualTopic = (
    index: number,
    field: 'topic' | 'explanation',
    value: string
  ) => {
    setManualTopics((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addManualTopic = () => {
    setManualTopics((prev) => [...prev, { topic: '', explanation: '' }]);
  };

  const removeManualTopic = (index: number) => {
    setManualTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const updateManualKeyword = (index: number, value: string) => {
    setManualKeywords((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  //function for lessonNode handler
  const handleToggleNode = (id: number) => {
    setSelectedNodeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const updateNodeAt = async (id: number, updatedNode: PlanLessonNode) => {
    if (!selectedNodes) return;
    const updatedNodes = selectedNodes.nodes.map((node, index) =>
      index === id ? updatedNode : node
    );

    await setSelectedNodes({
      ...selectedNodes,
      nodes: updatedNodes,
    });
  };

  const toast = useToast();

  const handleResponseNewExercise = (response: any, x: number, y: number) => {
    const exerciseResponse: AIExerciseGenerated = {
      ...response.data,
      ...response.data.generated_activities?.[0],
    };
    const _id = UUIDv4();
    const typeNode =
      QuestionTypeMap.find((type) => type.key == exerciseResponse.type)
        ?.nodeType || 'OpenQuestionNode';
    const data = dataFactory[typeNode]?.(exerciseResponse) || null;
    generatedNodes.push({
      _id: _id,
      type: typeNode,
      title: exerciseResponse.topic,
      description: exerciseResponse.topic_explanation,
      platform: 'WebApp',
      difficulty: 1,
      data: data,
      reactFlow: {
        id: _id,
        type: typeNode,
        position: {
          x: x,
          y: y,
        },
        width: 88,
        height: 46,
        selected: false,
        dragging: false,
        positionAbsolute: {
          x: x,
          y: y,
        },
        data: {},
      },
    });
  };

  const resetAll = () => {
    setGeneratingLoading(false);
    setSourceMaterial('');
    setContext('');
    setAnalyzedMaterial(undefined);
    setAINodes(undefined);
    setSelectedNodes(undefined);
    setLearningOutcome(undefined);
    setEduLevel(undefined);
    setSelectedTopic([]);
    setSelectedNodeIds([]);
    setExpandedIndexes([]);
    setNReadMaterial(1);
    setScreen1(true);
    setScreen2(false);
    setScreen3(false);
    generatedNodes.length = 0;
    setStepGeneration(0);
    setManualMode(false);
    setManualTitle('');
    setManualMacroSubject('');
    setManualLanguage('english');
    setManualDuration(20);
    setManualTopics([{ topic: '', explanation: '' }]);
    setManualKeywords(['', '', '', '']);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (action) action(false);
        onClose();
      }}
      size={'4xl'}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Do you need help to generate your learning path?
          <ModelAPIKey
            hidden={!screen1}
            model={model}
            setModel={setModel}
            llm_token={llm_token}
            setLlm_token={setLLMToken}
          />
          <Text hidden={!screen1}>
            STEP 1: Submit your material in this box to use our analyser.
          </Text>
          <Text hidden={!screen2}>
            STEP 2: Choose the Level and Topic you want to use, additionally add
            some context for the class.
          </Text>
          <Text hidden={!screen3}>
            STEP 3: Define the specifics for each activities.
          </Text>
          <FormLabel paddingTop={'5px'} hidden={!screen3}>
            Select and define activities to generate
          </FormLabel>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody hidden={!screen1}>
          {!manualMode ? (
            <>
              <FormLabel mb={2} fontWeight={'bold'}>
                Your material:
                <InfoButton
                  title="Material to Analyze"
                  description="Provide the source content you want the learning path to be built upon. This could be a text, article, lesson plan, or any other educational material."
                  placement="right"
                />
              </FormLabel>
              <Textarea
                minHeight={'150px'}
                maxHeight={'350px'}
                placeholder="Insert your material here, you can put your plain text."
                value={sourceMaterial}
                overflowY={'auto'}
                onChange={(e) => {
                  setGeneratingLoading(false);
                  setSourceMaterial(e.currentTarget.value);
                }}
              />

              <Button
                isDisabled={
                  !model || (model !== 'default' && llm_token.length === 0)
                }
                marginTop={'15px'}
                onClick={async () => {
                  try {
                    setGeneratingLoading(true);
                    if (!sourceMaterial) {
                      toast({
                        title: 'Material missing',
                        description:
                          'Please, insert your material before pressing analye button.',
                        status: 'error',
                        duration: 3000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                      throw new Error('Missing sourceMaterial');
                    }
                    const response: AxiosResponse = await API.analyseMaterial({
                      url: sourceMaterial,
                      model: model,
                      llm_token: llm_token,
                    });
                    console.log(response.data as AnalyzedMaterial);
                    setAnalyzedMaterial(response.data as AnalyzedMaterial);
                    setEduLevel(
                      response.data.education_level as EducationLevel
                    );
                    setLearningOutcome(
                      response.data.learning_outcome as LearningOutcome
                    );
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
                    toast({
                      title: 'Material Error',
                      description: getApiErrorMessage(
                        error,
                        'We are sorry, the resource is not analyzable, try with different material. Do not provide pages that are too long (e.g. Wikipedia pages) or too short, as they can not be analyzed correctly'
                      ),
                      status: 'error',
                      duration: 6000,
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
                marginTop={'15px'}
                marginLeft={'10px'}
                variant={'outline'}
                onClick={() => setManualMode(true)}
              >
                Skip step
              </Button>
            </>
          ) : (
            <>
              <Text>
                Fill in the information the analyser would normally have
                produced for you.
              </Text>

              <FormLabel mb={2} fontWeight={'bold'}>
                Material (optional, used as extra context for the activities):
              </FormLabel>
              <Textarea
                minHeight={'80px'}
                maxHeight={'200px'}
                placeholder="You can still paste some material here if you want it to inform the activities, this is optional."
                value={sourceMaterial}
                overflowY={'auto'}
                onChange={(e) => setSourceMaterial(e.currentTarget.value)}
              />

              <FormControl paddingTop={'5px'}>
                <FormLabel mb={2} fontWeight={'bold'}>
                  Title:
                </FormLabel>
                <Input
                  borderColor={'grey'}
                  placeholder="Insert a title for the learning path..."
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.currentTarget.value)}
                />
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel mb={2} fontWeight={'bold'}>
                  Macro Subject:
                </FormLabel>
                <Input
                  borderColor={'grey'}
                  placeholder="Insert the macro subject..."
                  value={manualMacroSubject}
                  onChange={(e) => setManualMacroSubject(e.currentTarget.value)}
                />
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel mb={2} fontWeight={'bold'}>
                  Language:
                </FormLabel>
                <Input
                  borderColor={'grey'}
                  placeholder="e.g. english"
                  value={manualLanguage}
                  onChange={(e) => setManualLanguage(e.currentTarget.value)}
                />
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel mb={2} fontWeight={'bold'}>
                  Estimated Duration (minutes):
                </FormLabel>
                <NumberInput
                  value={manualDuration}
                  min={1}
                  width={'100px'}
                  onChange={(valueString, valueNumber) => {
                    if (!isNaN(valueNumber)) setManualDuration(valueNumber);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel mb={2} fontWeight={'bold'}>
                  Educational Level:
                </FormLabel>
                <Select
                  borderColor={'grey'}
                  value={eduLevel || ''}
                  onChange={(event) =>
                    setEduLevel(event.currentTarget.value as EducationLevel)
                  }
                >
                  <option value="" disabled hidden>
                    Select a level...
                  </option>
                  {Object.values(EducationLevel).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel mb={2} fontWeight={'bold'}>
                  Learning Outcome:
                </FormLabel>
                <Select
                  borderColor={'grey'}
                  value={learningOutcome || ''}
                  onChange={(event) =>
                    setLearningOutcome(
                      event.currentTarget.value as LearningOutcome
                    )
                  }
                >
                  <option value="" disabled hidden>
                    Select a learning outcome...
                  </option>
                  {Object.values(LearningOutcome).map((outcome) => (
                    <option key={outcome} value={outcome}>
                      {outcome}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel mb={2} fontWeight={'bold'}>
                  Tags (used to label the learning path, up to 4):
                </FormLabel>
                <Flex gap={2} wrap={'wrap'}>
                  {manualKeywords.map((keyword, index) => (
                    <Input
                      key={index}
                      borderColor={'grey'}
                      width={'150px'}
                      placeholder={`Tag ${index + 1}`}
                      value={keyword}
                      onChange={(e) =>
                        updateManualKeyword(index, e.currentTarget.value)
                      }
                    />
                  ))}
                </Flex>
              </FormControl>

              <FormControl paddingTop={'5px'}>
                <FormLabel mb={2} fontWeight={'bold'}>
                  Topics:
                </FormLabel>
                {manualTopics.map((topicObj, index) => (
                  <Flex key={index} align="start" mb={3} gap={2}>
                    <Box flex={1}>
                      <Input
                        borderColor={'grey'}
                        marginBottom={'5px'}
                        placeholder="Topic name..."
                        value={topicObj.topic}
                        onChange={(e) =>
                          updateManualTopic(
                            index,
                            'topic',
                            e.currentTarget.value
                          )
                        }
                      />
                      <Textarea
                        borderColor={'grey'}
                        maxHeight={'120px'}
                        placeholder="Topic description..."
                        value={topicObj.explanation}
                        onChange={(e) =>
                          updateManualTopic(
                            index,
                            'explanation',
                            e.currentTarget.value
                          )
                        }
                      />
                    </Box>
                    <IconButton
                      aria-label="Remove topic"
                      icon={<CloseIcon />}
                      size="sm"
                      variant="ghost"
                      isDisabled={manualTopics.length <= 1}
                      onClick={() => removeManualTopic(index)}
                    />
                  </Flex>
                ))}
                <Button size="sm" onClick={addManualTopic}>
                  + Add topic
                </Button>
              </FormControl>

              <Flex marginTop={'15px'} gap={2}>
                <Button
                  isDisabled={
                    !model || (model !== 'default' && llm_token.length === 0)
                  }
                  onClick={() => {
                    if (
                      !manualTitle ||
                      !manualMacroSubject ||
                      !manualLanguage
                    ) {
                      toast({
                        title: 'Missing information',
                        description:
                          'Please fill in the title, macro subject and language before continuing.',
                        status: 'error',
                        duration: 3000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                      return;
                    }
                    if (!eduLevel || !learningOutcome) {
                      toast({
                        title: 'Missing information',
                        description:
                          'Please select an educational level and a learning outcome before continuing.',
                        status: 'error',
                        duration: 3000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                      return;
                    }
                    if (
                      manualTopics.length < 1 ||
                      manualTopics.some((t) => !t.topic)
                    ) {
                      toast({
                        title: 'Missing topics',
                        description:
                          'Please add at least one topic, and make sure every topic has a name.',
                        status: 'error',
                        duration: 3000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                      return;
                    }
                    setAnalyzedMaterial({
                      title: manualTitle,
                      macro_subject: manualMacroSubject,
                      language: manualLanguage,
                      education_level: eduLevel,
                      learning_outcome: learningOutcome,
                      estimated_duration: manualDuration,
                      topics: manualTopics,
                      keywords: manualKeywords,
                    } as AnalyzedMaterial);
                  }}
                >
                  Confirm Details
                </Button>
                <Button
                  variant={'outline'}
                  colorScheme={'teal'}
                  onClick={() => {
                    setManualTitle(EXAMPLE_ANALYZED_MATERIAL.title);
                    setManualMacroSubject(
                      EXAMPLE_ANALYZED_MATERIAL.macro_subject
                    );
                    setManualLanguage(EXAMPLE_ANALYZED_MATERIAL.language);
                    setManualDuration(
                      EXAMPLE_ANALYZED_MATERIAL.estimated_duration
                    );
                    setEduLevel(EXAMPLE_ANALYZED_MATERIAL.education_level);
                    setLearningOutcome(
                      EXAMPLE_ANALYZED_MATERIAL.learning_outcome
                    );
                    setManualTopics(EXAMPLE_ANALYZED_MATERIAL.topics);
                    setManualKeywords(EXAMPLE_ANALYZED_MATERIAL.keywords);
                  }}
                >
                  Insert example
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => setManualMode(false)}
                >
                  Back
                </Button>
              </Flex>
            </>
          )}
        </ModalBody>
        <ModalBody hidden={!screen2}>
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
                <option
                  key={level}
                  value={level}
                  selected={analysedMaterial?.education_level === level}
                >
                  {analysedMaterial?.education_level === level ? '*' : ''}
                  {level}
                  {analysedMaterial?.education_level === level ? '*' : ''}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl label="Learning Outcome">
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Learning Outcome:
              <InfoButton
                title="Learning Outcome"
                description="Describe the intended educational goal of the learning path. For example: 'the ability to recall or recognize simple facts and definitions.'"
                placement="right"
              />
            </FormLabel>
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setLearningOutcome(event.currentTarget.value as LearningOutcome)
              }
            >
              {Object.values(LearningOutcome).map((outcome) => (
                <option
                  key={outcome}
                  value={outcome}
                  selected={analysedMaterial?.learning_outcome === outcome}
                >
                  {analysedMaterial?.learning_outcome === outcome ? '*' : ''}
                  {outcome}
                  {analysedMaterial?.learning_outcome === outcome ? '*' : ''}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl label="Topic" paddingTop={'5px'}>
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Topics:
            </FormLabel>
            {analysedMaterial?.topics.map((topicObj, index) => (
              <Flex key={index} align="start" mb={3} direction="column">
                <Flex align="center">
                  <Checkbox
                    isChecked={isTopicSelected(topicObj)}
                    onChange={() => toggleTopic(topicObj)}
                    size="lg"
                    mr={2}
                    colorScheme="green"
                  />
                  <Text fontWeight="bold">{topicObj.topic}</Text>
                  <IconButton
                    size="sm"
                    ml={2}
                    aria-label="Toggle explanation"
                    icon={
                      expandedIndexes.includes(index) ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )
                    }
                    onClick={() => toggleExpand(index)}
                    variant="ghost"
                  />
                </Flex>
                <Collapse in={expandedIndexes.includes(index)} animateOpacity>
                  <Box mt={2} ml={6}>
                    <Text fontSize="sm" color="gray.600">
                      {topicObj.explanation}
                    </Text>
                  </Box>
                </Collapse>
              </Flex>
            ))}
          </FormControl>
          <FormControl label="Read Material Activities">
            <Flex paddingTop={'5px'} alignItems={'center'}>
              <FormLabel mb={2} fontWeight={'bold'}>
                Number of read material activities:
                <InfoButton
                  title="Number of Reading Activities"
                  description="Indicate how many activities should involve reading custom-generated texts. These texts will be tailored to the specific topics and context of the learning path."
                  placement="right"
                />
              </FormLabel>
              <NumberInput
                float="right"
                value={nReadMaterial}
                min={1}
                max={8}
                width="80px"
                onChange={(valueString, valueNumber) => {
                  if (!isNaN(valueNumber)) setNReadMaterial(valueNumber);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
          </FormControl>
          <FormLabel mb={2} fontWeight={'bold'}>
            Context (optional):
            <InfoButton
              title="Context"
              description="Explain the educational setting in which the learning path will be used. For instance: 'Middle school class with a focus on individual learning activities.'"
              placement="right"
            />
          </FormLabel>
          <Textarea
            maxHeight={'200px'}
            placeholder="Here, you can define the context of the learning path's application."
            value={context}
            overflowY={'auto'}
            onChange={(e) => {
              setGeneratingLoading(false);
              setContext(e.currentTarget.value);
            }}
          />
          <Button
            marginTop={'15px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                if (selectedTopic.length < 1) {
                  toast({
                    title: 'Missing topics',
                    description: 'You need to select at least one topic.',
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (!analysedMaterial) {
                  throw new Error('Missing analysedMaterial');
                }
                if (!learningOutcome || !eduLevel) {
                  throw new Error('Missing learningOutcome or eduLevel');
                }
                await API.planLesson({
                  topics: selectedTopic,
                  learning_outcome: learningOutcome,
                  language: analysedMaterial.language,
                  macro_subject: analysedMaterial.macro_subject,
                  title: analysedMaterial.title,
                  education_level: eduLevel,
                  context: context,
                  model: model,
                  llm_token: llm_token,
                }).then((response) => {
                  setAINodes(response.data);
                  const data: AIPlanLessonResponse = response.data;
                  const updatedNodes: PlanLessonNode[] = data.nodes.map(
                    (node) => {
                      const isIntegrated = QuestionTypeMap.find(
                        (qType) => qType.integrated && qType.key === node.type
                      );
                      const topicExplanation = selectedTopic.find(
                        (topic) => topic.topic === node.topic
                      )?.explanation;

                      return {
                        type: isIntegrated ? node.type : 'open question',
                        topic: node.topic,
                        explanation: topicExplanation || '',
                        details: node.details,
                        learning_outcome: node.learning_outcome,
                        duration: node.duration,
                        data: node.data,
                      };
                    }
                  );

                  setSelectedNodes({
                    ...data,
                    nodes: updatedNodes,
                  });
                });
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
                toast({
                  title: 'LearningObjective Error',
                  description: getApiErrorMessage(
                    error,
                    'We are sorry, server was not able to generate the learning objective. Please, try again, if the error persists try a different topic'
                  ),
                  status: 'error',
                  duration: 6000,
                  position: 'bottom-left',
                  isClosable: true,
                });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Plan Lesson
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen3}>
          <FormControl label="Nodes">
            <Box display="flex" flexDirection="column" overflowY="auto">
              {AINodes &&
                selectedNodes &&
                selectedNodes?.nodes.map((node, id) => {
                  return (
                    <PlanLessonCard
                      plannedNode={AINodes.nodes[id]}
                      planNode={node}
                      key={id}
                      id={id}
                      setSelectedNode={handleToggleNode}
                      isSelected={selectedNodeIds.includes(id)}
                      updateNodeAt={updateNodeAt}
                    />
                  );
                })}
            </Box>
          </FormControl>
          <ProgressBar
            currentStep={stepGeneration}
            totalSteps={nReadMaterial + selectedNodeIds.length}
            isHidden={!generatingLoading && generatedNodes.length == 0}
            label="Activities generation"
            description="Success! All activities have been generated. Finalizing the learning path..."
          />
          <Button
            marginTop={'15px'}
            onClick={async () => {
              generatedNodes.length = 0;
              setGeneratingLoading(true);
              if (!analysedMaterial)
                throw new Error('Missing analysedMaterial');
              try {
                const nodesToGenerate = selectedNodes?.nodes
                  .map((aiNode, index) => {
                    if (selectedNodeIds.includes(index)) return aiNode;
                  })
                  .filter((node) => node != undefined);
                if (!nodesToGenerate || !nodesToGenerate[0]) {
                  toast({
                    title: 'Missing activities',
                    description:
                      'Please, select at least one activity to start generating the learning path.',
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  throw new Error('Missing selectedNodes');
                }
                const nTopicReadMaterial =
                  nReadMaterial == 1
                    ? nodesToGenerate.length
                    : nReadMaterial < nodesToGenerate.length
                    ? Math.ceil(nodesToGenerate.length / nReadMaterial)
                    : 1;
                let counter = 0;
                console.log('Starting node generation');
                let x = -195;
                let y = -210;
                let localReadMaterial = nReadMaterial;
                for (let i = 0; i < nodesToGenerate.length; i++) {
                  if (counter == 0 && localReadMaterial != 0) {
                    i--;
                    counter = nTopicReadMaterial;
                    localReadMaterial--;
                    const readTopics: LessonNodeAI[] = nodesToGenerate
                      .map((aiNode, index) => {
                        if (aiNode && index < nTopicReadMaterial)
                          return {
                            title: '',
                            learning_outcome: aiNode.learning_outcome,
                            topics: [
                              {
                                topic: aiNode.topic,
                                explanation:
                                  analysedMaterial.topics.find(
                                    (topic) => topic.topic == aiNode?.topic
                                  )?.explanation || '',
                              },
                            ],
                          };
                        return undefined;
                      })
                      .filter(
                        (node): node is LessonNodeAI => node !== undefined
                      );
                    try {
                      const response = await API.generateMaterial({
                        title: analysedMaterial.title,
                        macro_subject: analysedMaterial.macro_subject,
                        topics: readTopics,
                        education_level: analysedMaterial.education_level,
                        learning_outcome: analysedMaterial.learning_outcome,
                        duration: analysedMaterial.estimated_duration,
                        language: analysedMaterial.language,
                        type_of_file: 'md',
                        model: model,
                        llm_token: llm_token,
                      } as AIMaterialType);

                      const readMaterialGen: AIMaterialGenerated = {
                        type_of_file: 'md',
                        content: response.data,
                      };

                      const _id = UUIDv4();

                      generatedNodes.push({
                        _id: _id,
                        type: 'ReadMaterialNode',
                        title: analysedMaterial.title,
                        description: analysedMaterial.macro_subject,
                        difficulty: 1,
                        platform: 'WebApp',
                        data: {
                          text: readMaterialGen.content,
                          link: '',
                        },
                        reactFlow: {
                          id: _id,
                          type: 'ReadMaterialNode',
                          position: {
                            x: x,
                            y: y,
                          },
                          width: 88,
                          height: 46,
                          selected: false,
                          dragging: false,
                          positionAbsolute: {
                            x: x,
                            y: y,
                          },
                          data: {},
                        },
                      });

                      x += 450;
                      if (x > 1605) {
                        x = -195;
                        y += 195;
                      }
                    } catch (error) {
                      console.log('errror in generation readMaterial ' + error);
                    }
                  } else {
                    counter--;
                    const activity = nodesToGenerate[i];
                    if (!activity) break;
                    const topicExplanation = selectedTopic.find(
                      (topic) => topic.topic === activity.topic
                    )?.explanation;
                    try {
                      let response: AxiosResponse | null = null;
                      const typeExercise =
                        activity.type != 'multiple choice'
                          ? activity.type
                          : activity.data?.solutions_number > 1
                          ? 'multiple select'
                          : 'multiple choice';
                      try {
                        response = await API.generateNewExercise({
                          macro_subject: activity?.learning_outcome,
                          topic: activity.topic,
                          topic_explanation: topicExplanation || '',
                          education_level: analysedMaterial.education_level,
                          learning_outcome: activity.learning_outcome,
                          material: sourceMaterial,
                          params: [
                            {
                              solutions_number:
                                activity.data?.solutions_number || 1,
                              distractors_number:
                                activity.data?.distractors_number || 2,
                              easily_discardable_distractors_number:
                                activity.data
                                  ?.easily_discardable_distractors_number || 1,
                              type: typeExercise,
                            },
                          ],
                          language: analysedMaterial.language,
                          model: model,
                          llm_token: llm_token,
                        });
                      } catch (err) {
                        console.warn('retry', err);

                        // Retry
                        response = await API.generateNewExercise({
                          macro_subject: activity?.learning_outcome,
                          topic: activity.topic,
                          topic_explanation: topicExplanation || '',
                          education_level: analysedMaterial.education_level,
                          learning_outcome: activity.learning_outcome,
                          material: sourceMaterial,
                          params: [
                            {
                              solutions_number:
                                activity.data?.solutions_number || 1,
                              distractors_number:
                                activity.data?.distractors_number || 2,
                              easily_discardable_distractors_number:
                                activity.data
                                  ?.easily_discardable_distractors_number || 1,
                              type: typeExercise,
                            },
                          ],
                          language: analysedMaterial.language,
                          model: model,
                          llm_token: llm_token,
                        });
                      }

                      // if one of the retries worked, handle the response
                      if (response) {
                        handleResponseNewExercise(response, x, y);
                      }
                    } catch (error) {
                      console.error('Error on generating exercise: ', error);
                    }
                  }
                  x = x + 450;
                  if (x > 1605) {
                    x = -195;
                    y = y + 195;
                  }
                  setStepGeneration(generatedNodes.length);
                }
                setNReadMaterial(0);
                const idEnd = UUIDv4();
                generatedNodes.push({
                  _id: idEnd,
                  type: 'ReadMaterialNode',
                  title: 'End',
                  description: 'End of the learning path',
                  difficulty: 1,
                  platform: 'WebApp',
                  data: {
                    text:
                      'You have completed this learning path on ' +
                      analysedMaterial.macro_subject +
                      ', congratulation!',
                    link: '',
                  },
                  reactFlow: {
                    id: idEnd,
                    type: 'ReadMaterialNode',
                    position: {
                      x: x,
                      y: y,
                    },
                    width: 88,
                    height: 46,
                    selected: false,
                    dragging: false,
                    positionAbsolute: {
                      x: x,
                      y: y,
                    },
                    data: {},
                  },
                });

                console.log('End data generation');
                const generatedEdges: PolyglotEdge[] = [];

                //edges generation
                const length = generatedNodes.length;
                for (let i = 0; i < length; i++) {
                  const node = generatedNodes[i];
                  const nextNode = generatedNodes[i + 1];

                  if (node.title != 'End')
                    if (node.type == 'ReadMaterialNode') {
                      const id = UUIDv4();
                      generatedEdges.push({
                        _id: id,
                        type: 'unconditionalEdge',
                        code: `
                    async Task<(bool, string)> validate(PolyglotValidationContext context) {
                        return (true, "Unconditional edge");
                    }
                    `,
                        data: {
                          conditionKind: 'pass',
                        },
                        reactFlow: {
                          id: id,
                          source: node._id,
                          target: nextNode._id,
                          type: 'unconditionalEdge',
                          markerEnd: {
                            color: 'grey',
                            type: MarkerType.Arrow,
                            width: 25,
                            height: 25,
                          },
                          selected: true,
                        },
                        title: 'next',
                      });
                    } else {
                      const idRecovery = UUIDv4();
                      const x = node.reactFlow.position.x;
                      const y = node.reactFlow.position.y + 100;
                      generatedNodes.push({
                        _id: idRecovery,
                        type: 'abstractNode',
                        title: 'Recovery Activity',
                        description: 'Recovery activity',
                        platform: 'Library',
                        difficulty: 1,
                        data: {
                          useFlowData: true,
                          sourceMaterial: sourceMaterial,
                          learning_outcome: learningOutcome,
                          education_level: eduLevel,
                          topicsAI: selectedTopic,
                          language: analysedMaterial.language,
                          macro_subject: analysedMaterial.macro_subject,
                          title: analysedMaterial.title,
                          context: context,
                        },
                        reactFlow: {
                          id: idRecovery,
                          type: 'abstractNode',
                          position: {
                            x: x,
                            y: y,
                          },
                          width: 88,
                          height: 46,
                          selected: false,
                          dragging: false,
                          positionAbsolute: {
                            x: x,
                            y: y,
                          },
                          data: {},
                        },
                      });
                      const id1 = UUIDv4();
                      generatedEdges.push({
                        _id: id1,
                        type: 'passFailEdge',
                        code: `\nasync Task<(bool, string)> validate(PolyglotValidationContext context) {\n    var getMultipleChoiceAnswer = () => {\n        var submitted = context.JourneyContext.EventsProduced.OfType<ReturnValueProduced>().FirstOrDefault()?.Value as HashSet<string>;\n        var answersCorrect = ((List<object>)context.Exercise.Data.isChoiceCorrect).Select((c, i) => (c, i))\n                                                                                .Where(c => bool.Parse(c.c.ToString()))\n                                                                                .Select(c => (c.i + 1).ToString())\n                                                                                .ToHashSet();\n        return submitted.SetEquals(answersCorrect);\n    };\n\n    var isSubmissionCorrect = context.Exercise.NodeType switch\n    {\n        \"multipleChoiceQuestionNode\" => getMultipleChoiceAnswer(),\n        _ => context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode),\n    };\n\n    var conditionKind = context.Condition.Data.conditionKind switch\n    {\n        \"pass\" => true,\n        \"fail\" => false,\n        _ => throw new Exception(\"Unknown condition kind\")\n    };\n    return (conditionKind == isSubmissionCorrect, \"Pass/Fail edge\");\n}    \n
                    `,
                        data: {
                          conditionKind: 'pass',
                        },
                        reactFlow: {
                          id: id1,
                          source: node._id,
                          target: nextNode._id,
                          type: 'passFailEdge',
                          markerEnd: {
                            color: 'green',
                            type: MarkerType.Arrow,
                            width: 25,
                            height: 25,
                          },
                          selected: true,
                        },
                        title: 'pass',
                      });
                      const id2 = UUIDv4();
                      generatedEdges.push({
                        _id: id2,
                        type: 'passFailEdge',
                        code: `\nasync Task<(bool, string)> validate(PolyglotValidationContext context) {\n    var getMultipleChoiceAnswer = () => {\n        var submitted = context.JourneyContext.EventsProduced.OfType<ReturnValueProduced>().FirstOrDefault()?.Value as HashSet<string>;\n        var answersCorrect = ((List<object>)context.Exercise.Data.isChoiceCorrect).Select((c, i) => (c, i))\n                                                                                .Where(c => bool.Parse(c.c.ToString()))\n                                                                                .Select(c => (c.i + 1).ToString())\n                                                                                .ToHashSet();\n        return submitted.SetEquals(answersCorrect);\n    };\n\n    var isSubmissionCorrect = context.Exercise.NodeType switch\n    {\n        \"multipleChoiceQuestionNode\" => getMultipleChoiceAnswer(),\n        _ => context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode),\n    };\n\n    var conditionKind = context.Condition.Data.conditionKind switch\n    {\n        \"pass\" => true,\n        \"fail\" => false,\n        _ => throw new Exception(\"Unknown condition kind\")\n    };\n    return (conditionKind == isSubmissionCorrect, \"Pass/Fail edge\");\n}    \n
                    `,
                        data: {
                          conditionKind: 'fail',
                        },
                        reactFlow: {
                          id: id2,
                          source: node._id,
                          target: idRecovery,
                          type: 'passFailEdge',
                          markerEnd: {
                            color: 'red',
                            type: MarkerType.Arrow,
                            width: 25,
                            height: 25,
                          },
                          selected: true,
                        },
                        title: 'fail',
                      });
                      const id3 = UUIDv4();
                      generatedEdges.push({
                        _id: id3,
                        type: 'passFailEdge',
                        code: `\nasync Task<(bool, string)> validate(PolyglotValidationContext context) {\n    var getMultipleChoiceAnswer = () => {\n        var submitted = context.JourneyContext.EventsProduced.OfType<ReturnValueProduced>().FirstOrDefault()?.Value as HashSet<string>;\n        var answersCorrect = ((List<object>)context.Exercise.Data.isChoiceCorrect).Select((c, i) => (c, i))\n                                                                                .Where(c => bool.Parse(c.c.ToString()))\n                                                                                .Select(c => (c.i + 1).ToString())\n                                                                                .ToHashSet();\n        return submitted.SetEquals(answersCorrect);\n    };\n\n    var isSubmissionCorrect = context.Exercise.NodeType switch\n    {\n        \"multipleChoiceQuestionNode\" => getMultipleChoiceAnswer(),\n        _ => context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode),\n    };\n\n    var conditionKind = context.Condition.Data.conditionKind switch\n    {\n        \"pass\" => true,\n        \"fail\" => false,\n        _ => throw new Exception(\"Unknown condition kind\")\n    };\n    return (conditionKind == isSubmissionCorrect, \"Pass/Fail edge\");\n}    \n
                    `,
                        data: {
                          conditionKind: 'pass',
                        },
                        reactFlow: {
                          id: id3,
                          source: idRecovery,
                          target: nextNode._id,
                          type: 'passFailEdge',
                          markerEnd: {
                            color: 'green',
                            type: MarkerType.Arrow,
                            width: 25,
                            height: 25,
                          },
                          selected: true,
                        },
                        title: 'pass',
                      });
                    }
                }

                console.log('end node generation');
                const tags: { name: string; color: string }[] = [
                  { name: analysedMaterial.keywords[0], color: 'green' },
                  { name: analysedMaterial.keywords[1], color: 'red' },
                  { name: analysedMaterial.keywords[2], color: 'purple' },
                  { name: analysedMaterial.keywords[3], color: 'blue' },
                ];
                const topics = analysedMaterial.topics.map((t) => t.topic);

                const newFlow: PolyglotFlow = {
                  _id: UUIDv4(),
                  author: {
                    _id: 'afa2e0e7-e3d1-4837-b911-0eebac05f845',
                    username: '',
                  },
                  title: analysedMaterial.title,
                  description: analysedMaterial.macro_subject,
                  publish: false,
                  learningContext: analysedMaterial.learning_outcome,
                  duration: analysedMaterial.estimated_duration.toString(),
                  topics: topics,
                  tags: tags,
                  sourceMaterial: sourceMaterial,
                  learning_outcome: learningOutcome,
                  education_level: eduLevel,
                  topicsAI: selectedTopic,
                  language: analysedMaterial.language,
                  macro_subject: analysedMaterial.macro_subject,
                  nodes: generatedNodes,
                  edges: generatedEdges,
                };
                const flowResponse = await API.createNewFlowJson(newFlow);
                if (flowResponse.status !== 200) {
                  onClose();
                  toast({
                    title: 'Flow not created',
                    description: 'Something is off with your flow! Try again',
                    status: 'warning',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                }
                toast({
                  title: 'Flow created',
                  description:
                    'Flow created successfully, you will be redirected soon.',
                  status: 'success',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                router.push('/flows/' + flowResponse.data.id);
              } catch (error) {
                toast({
                  title: 'Learning Path Error',
                  description: getApiErrorMessage(
                    error,
                    'We are sorry, server was not able to generate the learning path. Please, try again, if the error persists, you should restart.'
                  ),
                  status: 'error',
                  duration: 6000,
                  position: 'bottom-left',
                  isClosable: true,
                });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
            isDisabled={generatingLoading || generatedNodes.length != 0}
          >
            Generate Learning Path
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button onClick={resetAll} width={'80px'}>
            Restart
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAILPModal;
