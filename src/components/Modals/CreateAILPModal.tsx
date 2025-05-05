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
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  AIPlanLessonResponse,
  AnalyzedMaterial,
  EducationLevel,
  LearningOutcome,
  PlanLessonNode,
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

  useEffect(() => {
    console.log(selectedNodeIds);
  }, [selectedNodeIds]);

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

  const [screen1, setScreen1] = useState(true);
  const [screen2, setScreen2] = useState(false);
  const [screen3, setScreen3] = useState(false);
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
                  //
                  throw ': no text given';
                }
                /*const response: AxiosResponse = await API.analyseMaterial({
                  text: sourceMaterial,
                });*/
                const response = {
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
                };
                console.log(response.data as AnalyzedMaterial);
                setAnalyzedMaterial(response.data as AnalyzedMaterial);
                setEduLevel(response.data.education_level as EducationLevel);
                setLearningOutcome(
                  response.data.learning_outcome as LearningOutcome
                );
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
                if (!analysedMaterial) {
                  toast({
                    title: 'Missing Material',
                    description: 'No analysed material given',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (!eduLevel || !learningOutcome) {
                  console.log(eduLevel);
                  toast({
                    title: 'Missing Material',
                    description: 'Error in datas',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                } /*
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
                });*/
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
                setAINodes(response2.data as AIPlanLessonResponse);
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
          <Button
            marginTop={'15px'}
            onClick={async () => {
              /*continue from here da mettere la creazione
              un'idea potrebbe essere aggiungere un pulsante che dice "aggiungi attività read Material prima di questa activity" 
                -> avrei già qualche valus settata ((topics sarebbe incasinata)):
                  "topic": "Introduzione alla vita di Michelangelo",
                  "details": "Presentazione della vita di Michelangelo Buonarroti: contesto storico, famiglia, e primi anni di formazione. Accennare alle influenze artistiche iniziali.",
                  "learning_outcome": "the ability to recall or recognize simple facts and definitions",
                  "duration": 20

              un'altra idea è mettere nello step 2 una selezione con quante lezioni readMaterial mettere ed eventualmente capire a quanti topic sono legati
                (mancherebbe il learning outcome ma si può scegliere dopo)
              nota: da inserire anche l'aggiunta di readMaterial nodes->body:{
                title: string;
                macro_subject: string;
                topics: LessonNodeAI[]; 
                education_level: EducationLevel;
                learning_outcome: LearningOutcome;
                duration: number;
                language: string;
                model: string;
              };
              */
              console.log('GenerateLP');
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
