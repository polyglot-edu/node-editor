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
import {
  AIPlanLessonResponse,
  AnalyzedMaterial,
  EducationLevel,
  LearningOutcome,
  PlanLessonNode,
  QuestionTypeMap,
  Topic,
} from '../../types/polyglotElements/AIGenerativeTypes/AIGenerativeTypes';
import PlanLessonCard from '../Card/PlanLessonCard';

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

const CreateAILPModal = ({
  isOpen,
  onClose,
  exType,
  action,
}: ModaTemplateProps) => {
  const [analysedMaterial, setAnalyzedMaterial] = useState<AnalyzedMaterial>();
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [context, setContext] = useState('');
  const [AINodes, setAINodes] = useState<AIPlanLessonResponse>();
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
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);

  const handleToggleNode = (id: number) => {
    setSelectedNodeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const updateNodeAt = (id: number, updatedNode: PlanLessonNode) => {
    if (!AINodes) return;

    const updatedNodes = AINodes.nodes.map((node, index) =>
      index === id ? updatedNode : node
    );

    setAINodes({
      ...AINodes,
      nodes: updatedNodes,
    });
  };

  const [selectedTopic, setSelectedTopic] = useState<Topic[]>([]);
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
                  text: sourceMaterial,
                });
                console.log(response.data as AnalyzedMaterial);
                setAnalyzedMaterial(response.data);
                //continua da qui.
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
        </ModalBody>
        <ModalBody hidden={!screen2}>
          <Text>
            STEP 2: Choose the Level and Topic you want to use, additionally add
            some context for the class.
          </Text>
          <FormControl label="Level">
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Educational Level:
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
              Topic:
            </FormLabel>
            <Select
              multiple
              borderColor={'grey'}
              onChange={(event) => {
                if (!analysedMaterial) return;
                const selectedValues = Array.from(
                  event.target.selectedOptions,
                  (option) => Number(option.value)
                );

                const selectedTopics = selectedValues.map((id) => ({
                  topic: analysedMaterial.topics[id].topic,
                  explanation: analysedMaterial.topics[id].explanation,
                }));

                setSelectedTopic(selectedTopics);
              }}
            >
              {
                <>
                  {analysedMaterial?.topics.map((p, id) => {
                    return (
                      <option key={id} value={id}>
                        <Box width={'100px'}>
                          {p.topic}
                          <FormLabel
                            mb={2}
                            fontWeight={'bold'}
                            paddingTop={'5px'}
                            paddingBottom={'-5px'}
                          >
                            Topic Description:
                          </FormLabel>
                          <Text>{p.explanation}</Text>
                        </Box>
                      </option>
                    );
                  })}
                </>
              }
            </Select>
          </FormControl>
          <FormLabel mb={2} fontWeight={'bold'}>
            Context (optional):
          </FormLabel>
          <Textarea
            maxHeight={'200px'}
            placeholder="Insert your material here, you can put your plain text or the link (attention some websites are crypted, sometimes the tool cannot access the actual text)..."
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
                if (!analysedMaterial) throw ': no analysed material given';
                if (!eduLevel || !learningOutcome) throw ': error in datas';

                API.planLesson({
                  topics: selectedTopic,
                  learning_outcome: learningOutcome,
                  language: analysedMaterial.language,
                  macro_subject: analysedMaterial.macro_subject,
                  title: analysedMaterial.title,
                  education_level: eduLevel,
                  context: context,
                  model: 'Gemini',
                }).then((response) => {
                  setAINodes(response.data);
                });
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
            Plan Lesson
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen3}>
          <Text>STEP 3: Define the specifics for each activities.</Text>
          <FormLabel paddingTop={'5px'}>Select Nodes to generate</FormLabel>
          <FormControl label="Nodes">
            <Box display="flex" flexDirection="column">
              {AINodes?.nodes.map((node, id) => (
                <PlanLessonCard
                  planNode={node}
                  key={id}
                  id={id}
                  setSelectedNode={handleToggleNode}
                  isSelected={selectedNodeIds.includes(id)}
                  updateNodeAt={updateNodeAt}
                />
              ))}
            </Box>
          </FormControl>
          {/*continue from here da mettere la decisione del tipo di attività*/}
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
              console.log('GenerateActivity');
            }}
            isLoading={generatingLoading}
          >
            Generate Learning Activity
          </Button>
          <Button
            hidden={exerciseTypeKey != 'ReadMaterial'}
            marginTop={'15px'}
            onClick={async () => {
              console.log('generateMaterial: readMaterial');
              /*
              try {
                if (exerciseType != 'ReadMaterial') return;
                if (eduLevel == undefined || learningOutcome == undefined)
                  throw ': error in eduLevel and learningOutcome';
                setGeneratingLoading(true);
                if (!topicGen) throw ': no topic generated';
                const response: AxiosResponse = await API.generateMaterial({
                  title: titleGen,
                  macro_subject: macroSubjectGen,
                  topics: [
                    {
                      title: titleGen,
                      learning_outcome: learningOutcome,
                      topics: topicGen,
                    },
                  ],
                  education_level: eduLevel,
                  learning_outcome: learningOutcome,
                  duration: duration,
                  language: language,
                  model: 'Gemini',
                });
                setScreen1(true);
                setScreen3(false);
                console.log(response.data);
                const dataGen: AIMaterialGenerated = response.data;
                let adaptedData;
                switch (exerciseType) {
                  case 'ReadMaterial':
                    console.log('creating readMaterial');
                    adaptedData = {
                      text: dataGen.material,
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
              }*/
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

export default CreateAILPModal;
