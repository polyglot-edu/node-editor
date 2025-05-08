import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
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
import {
  PolyglotEdge,
  PolyglotFlow,
  PolyglotNode,
} from '../../types/polyglotElements';
import {
  AIExerciseGenerated,
  AIMaterialGenerated,
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
      question: values.assignment,
      choices: shuffleAnswers,
      isChoiceCorrect: isAnswerCorrect,
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
  const [learningOutcome, setLearningOutcome] = useState<LearningOutcome>();
  const [eduLevel, setEduLevel] = useState<EducationLevel>();
  const [selectedTopic, setSelectedTopic] = useState<Topic[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [nReadMaterial, setNReadMaterial] = useState(1);
  const [screen1, setScreen1] = useState(true);
  const [screen2, setScreen2] = useState(false);
  const [screen3, setScreen3] = useState(false);

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

  //function for lessonNode handler
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

  const toast = useToast();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (action) action(false);
        onClose();
      }}
      size={'2xl'}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Do you need help to generate your learning path?
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
          <FormLabel mb={2} fontWeight={'bold'}>
            Your material:
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
                  text: sourceMaterial,
                });
                /*const response = {
                  data: {
                    language: 'Italian',
                    macro_subject: 'Arte',
                    title: 'Biografia di Michelangelo',
                    education_level: 'high school',
                    learning_outcome:
                      'the ability to explain concepts and principles, and recognize how different ideas are related',
                    topics: [
                      {
                        topic: 'Infanzia e formazione',
                        explanation:
                          "Nascita a Caprese, primi anni a Firenze, apprendistato presso Ghirlandaio e l'influenza di Lorenzo de' Medici.",
                      },
                      {
                        topic: 'Primi lavori a Firenze e Bologna',
                        explanation:
                          "Realizzazione delle prime sculture, inclusi 'La battaglia dei Centauri' e la 'Madonna della scala'. Breve soggiorno a Venezia e Bologna, con partecipazione alla scultura dell' Arca di San Domenico.",
                      },
                      {
                        topic: 'Periodo Romano',
                        explanation:
                          "Trasferimento a Roma, realizzazione del 'Bacco' e della 'Pietà'. Commissione e realizzazione della tomba di Giulio II e della Cappella Sistina.",
                      },
                      {
                        topic: 'Ritorno a Firenze e Progetti Medicei',
                        explanation:
                          "Lavori per Leone X e Clemente VII, inclusa la Sagrestia Nuova e la Biblioteca Laurenziana. Coinvolgimento nelle fortificazioni di Firenze durante l'assedio.",
                      },
                      {
                        topic: 'Ultimi anni a Roma',
                        explanation:
                          "Realizzazione del 'Giudizio Universale' nella Cappella Sistina. Scultura della 'Pietà Rondanini' e altri progetti architettonici, inclusa la cupola di San Pietro. Riflessioni sulla morte e opere incompiute.",
                      },
                    ],
                    keywords: [
                      'Michelangelo',
                      'Buonarroti',
                      'biografia',
                      'scultura',
                      'pittura',
                      'Rinascimento',
                      'Firenze',
                      'Roma',
                      'Cappella Sistina',
                      'David',
                      'Pietà',
                      'arte',
                      "storia dell'arte",
                    ],
                    prerequisites: [
                      'Conoscenza generale del Rinascimento italiano',
                      'Familiarità con i principali artisti del Rinascimento',
                      "Interesse per la storia dell'arte",
                    ],
                    estimated_duration: 60,
                  },
                };*/
                console.log(response.data as AnalyzedMaterial);
                setAnalyzedMaterial(response.data as AnalyzedMaterial);
                setEduLevel(response.data.education_level as EducationLevel);
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
          <FormControl label="Learning Outcome">
            <Flex paddingTop={'5px'} alignItems={'center'}>
              <FormLabel mb={2} fontWeight={'bold'}>
                Number of read material activities:
              </FormLabel>
              <NumberInput
                float={'right'}
                defaultValue={nReadMaterial}
                min={1}
                max={8}
                width={'80px'}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper
                    onClick={() => setNReadMaterial(nReadMaterial + 1)}
                  />
                  <NumberDecrementStepper
                    onClick={() => setNReadMaterial(nReadMaterial - 1)}
                  />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
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
                  model: 'Gemini',
                }).then((response) => {
                  setAINodes(response.data);
                });
                /*
                const response2 = {
                  data: {
                    title: 'Biografia di Michelangelo',
                    macro_subject: 'Arte',
                    education_level: 'college',
                    learning_outcome:
                      'the ability to recall or recognize simple facts and definitions',
                    prerequisites: [
                      "Conoscenza di base della storia dell'arte rinascimentale",
                      'Familiarità con le principali tecniche artistiche (scultura, pittura, architettura)',
                      'Capacità di analisi iconografica e stilistica',
                      'Conoscenza del contesto storico e culturale del Rinascimento italiano',
                    ],
                    nodes: [
                      {
                        type: 'knowledge exposition',
                        topic: 'Introduzione alla vita di Michelangelo',
                        details:
                          'Presentazione della vita di Michelangelo Buonarroti: contesto storico, famiglia, e primi anni di formazione. Accennare alle influenze artistiche iniziali.',
                        learning_outcome:
                          'the ability to recall or recognize simple facts and definitions',
                        duration: 20,
                      },
                      {
                        type: 'non written material analysis',
                        topic: "Le prime opere e l'influenza di Firenze",
                        details:
                          "Analisi di immagini delle prime sculture di Michelangelo (es. Madonna della Scala, Battaglia dei Centauri). Discussione sull'influenza dell'arte classica e di Donatello.",
                        learning_outcome:
                          'the ability to explain concepts and principles, and recognize how different ideas are related',
                        duration: 30,
                      },
                      {
                        type: 'knowledge exposition',
                        topic: 'Il David e la consacrazione a Firenze',
                        details:
                          "Spiegazione del contesto della commissione del David, la sua realizzazione e il significato politico e artistico dell'opera. Approfondimento sulle tecniche scultoree utilizzate.",
                        learning_outcome:
                          'the ability to recall or recognize simple facts and definitions',
                        duration: 25,
                      },
                      {
                        type: 'group discussion',
                        topic: 'Discussione: Il David come simbolo',
                        details:
                          "Organizzare una discussione di gruppo sul significato del David come simbolo di Firenze e della sua importanza nella storia dell'arte. Incoraggiare gli studenti a esprimere le proprie interpretazioni.",
                        learning_outcome:
                          'the ability to explain concepts and principles, and recognize how different ideas are related',
                        duration: 30,
                      },
                      {
                        type: 'knowledge exposition',
                        topic: 'Il trasferimento a Roma e il periodo papale',
                        details:
                          'Presentazione del trasferimento di Michelangelo a Roma e delle commissioni papali: la Pietà, la Cappella Sistina (volta e Giudizio Universale), e il progetto per la tomba di Giulio II.',
                        learning_outcome:
                          'the ability to recall or recognize simple facts and definitions',
                        duration: 30,
                      },
                      {
                        type: 'non written material analysis',
                        topic: 'Analisi della Cappella Sistina',
                        details:
                          "Analisi dettagliata di alcune scene della volta della Cappella Sistina (es. Creazione di Adamo) e del Giudizio Universale. Discussione sull'iconografia, lo stile e le tecniche pittoriche utilizzate.",
                        learning_outcome:
                          'the ability to explain concepts and principles, and recognize how different ideas are related',
                        duration: 40,
                      },
                      {
                        type: 'essay',
                        topic:
                          'Saggio breve: Confronto tra la Pietà vaticana e la Pietà Rondanini',
                        details:
                          'Assegnare un saggio breve in cui gli studenti confrontano la Pietà vaticana con la Pietà Rondanini, analizzando le differenze stilistiche e il cambiamento nella visione artistica di Michelangelo.',
                        learning_outcome:
                          'the ability to apply knowledge and perform operations in practical contexts',
                        duration: 45,
                      },
                      {
                        type: 'knowledge exposition',
                        topic: 'Michelangelo architetto: San Pietro',
                        details:
                          'Presentazione del ruolo di Michelangelo come architetto nella costruzione della Basilica di San Pietro. Focus sulla cupola e sulle modifiche apportate al progetto originale.',
                        learning_outcome:
                          'the ability to recall or recognize simple facts and definitions',
                        duration: 20,
                      },
                      {
                        type: 'problem solving activity',
                        topic: 'Sfida: Progettare una cupola',
                        details:
                          'Proporre agli studenti una sfida di problem solving in cui devono progettare una cupola ispirata a quella di San Pietro, tenendo conto dei principi di statica e resistenza dei materiali.',
                        learning_outcome:
                          'the ability to apply knowledge and perform operations in practical contexts',
                        duration: 40,
                      },
                      {
                        type: 'knowledge exposition',
                        topic: "Gli ultimi anni e l'eredità artistica",
                        details:
                          "Presentazione degli ultimi anni di vita di Michelangelo, le sue riflessioni sull'arte e la sua eredità artistica. Accennare all'influenza di Michelangelo sui successivi artisti.",
                        learning_outcome:
                          'the ability to recall or recognize simple facts and definitions',
                        duration: 20,
                      },
                      {
                        type: 'open question',
                        topic:
                          "Discussione finale: L'importanza di Michelangelo",
                        details:
                          "Aprire una discussione finale sull'importanza di Michelangelo nella storia dell'arte e sulla sua influenza sulla cultura occidentale. Incoraggiare gli studenti a condividere le proprie riflessioni e conclusioni.",
                        learning_outcome:
                          'the ability to assess your own understanding, identify gaps in knowledge, and strategize ways to close those gaps',
                        duration: 20,
                      },
                    ],
                    context: '',
                    language: 'Italian',
                  },
                };
                setAINodes(response2.data as AIPlanLessonResponse);*/
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
                else {
                  toast({
                    title: 'Generic Error',
                    description: 'Try later: ' + (error as Error).message,
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                }
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
            <Box display="flex" flexDirection="column">
              {AINodes?.nodes.map((node, id) => {const suggestedType= node.type; return(
                <PlanLessonCard
                  planNode={node}
                  key={id}
                  id={id}
                  setSelectedNode={handleToggleNode}
                  isSelected={selectedNodeIds.includes(id)}
                  updateNodeAt={updateNodeAt}
                  suggestedType={suggestedType}
                />
              )})}
            </Box>
          </FormControl>
          <Button
            marginTop={'15px'}
            onClick={async () => {
              setGeneratingLoading(true);
              if (!analysedMaterial)
                throw new Error('Missing analysedMaterial');
              try {
                const selectedNodes = AINodes?.nodes
                  .map((aiNode, index) => {
                    if (selectedNodeIds.includes(index)) return aiNode;
                  })
                  .filter((node) => node != undefined);
                if (!selectedNodes || !selectedNodes[0]) {
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
                    ? selectedNodes.length
                    : nReadMaterial < selectedNodes.length
                    ? Math.ceil(selectedNodes.length / nReadMaterial)
                    : 1;
                const generatedNodes: PolyglotNode[] = [];
                let counter = 0;
                let check = 0;
                do {
                  check++;
                  if (counter == 0 && nReadMaterial != 0) {
                    counter = nTopicReadMaterial;
                    setNReadMaterial(nReadMaterial - 1);
                    const readTopics: LessonNodeAI[] = selectedNodes
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
                        model: 'Gemini',
                      });
                      const readMaterialGen: AIMaterialGenerated =
                        response.data;
                      const _id = UUIDv4();
                      const x = -195 + 50 * generatedNodes.length;
                      const y = -210 + 100 * generatedNodes.length;
                      generatedNodes.push({
                        _id: _id,
                        type: 'ReadMaterialNode',
                        title: readMaterialGen.title,
                        description: readMaterialGen.macro_subject,
                        difficulty: 1,
                        platform: 'WebApp',
                        data: {
                          text: readMaterialGen.material,
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
                    } catch (error) {
                      console.log('errror in generation readMaterial ' + error);
                    }
                  } else {
                    counter--;
                    const activity = selectedNodes.shift();
                    if (!activity) break;
                    try {
                      await API.generateNewExercise({
                        macro_subject: activity?.learning_outcome,
                        topic: activity.topic,
                        education_level: analysedMaterial.education_level,
                        learning_outcome: activity.learning_outcome,
                        material: sourceMaterial,
                        solutions_number: activity.data?.solutions_number || 0,
                        distractors_number:
                          activity.data?.distractors_number || 0,
                        easily_discardable_distractors_number:
                          activity.data
                            ?.easily_discardable_distractors_number || 0,
                        type: activity.type,
                        language: analysedMaterial.language,
                        model: 'Gemini',
                      }).then((response) => {
                        const exerciseResponse: AIExerciseGenerated =
                          response.data;
                        const _id = UUIDv4();
                        const typeNode =
                          QuestionTypeMap.find(
                            (type) => type.key == exerciseResponse.type
                          )?.nodeType || 'OpenQuestionNode';
                        const data =
                          dataFactory[typeNode]?.(exerciseResponse) || null;
                        const x = -195 + 50 * generatedNodes.length;
                        const y = -210 + 100 * generatedNodes.length;
                        generatedNodes.push({
                          _id: _id,
                          type: typeNode,
                          title: exerciseResponse.topic,
                          description: exerciseResponse.macro_subject,
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
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }
                } while (
                  selectedNodes.length + nReadMaterial !=
                    generatedNodes.length ||
                  check < selectedNodes.length + nReadMaterial
                );
                const generatedEdges: PolyglotEdge[] = [];

                //edges generation
                for (let i = 0; i < generatedNodes.length - 1; i++) {
                  const node = generatedNodes[i];
                  const nextNode = generatedNodes[i + 1];

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
                        target: node._id,
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
                  }
                }

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
                router.push('/flows/' + flowResponse.data.id);
              } catch (error) {
                toast({
                  title: 'Generic Error',
                  description: 'Try later: ' + (error as Error).message,
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
            Generate Learning Path
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              setScreen1(true);
              setScreen2(false);
              setScreen3(false);
              setSourceMaterial('');
              setGeneratingLoading(false);
              setContext('');
              setAINodes(undefined);
              setLearningOutcome(undefined);
              setEduLevel(undefined);
              setSelectedTopic([]);
              setSelectedNodeIds([]);
              setExpandedIndexes([]);
              setNReadMaterial(1);
            }}
            width={'80px'}
          >
            Restart
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAILPModal;
