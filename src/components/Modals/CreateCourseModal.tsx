import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import { APIV2 } from '../../data/api';
import { LOType, PolyglotCourseBody, PolyglotCourseInfo, PolyglotLessonBody, Topic } from '../../types/polyglotElements';
import TableLearningPath from '../Tables/LearningPathTable';
import { rowData } from '../Tables/LearningPathTable/CustomLearningPathTable';

type CreateCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  API: APIV2;
  setOpenModal: (value: string) => void;
};

type Lesson ={
    Title: string;
    Topics: string[];
};

export type Activity ={
  Type: boolean;
  Topic: string;
  Details: string;
  Duration: number;
};

export type finishedLesson={
  title: string;
  description: string;
  activities: finishedActivity[];
}

type finishedActivity ={
  lessonType: string;
  activityType: string;
  timeDuration: number;
  activityDescription: string;
}

export const colors = [
  'gray',
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
];

const CreateCourseModal = ({
  isOpen,
  onClose,
  API,
  setOpenModal,
}: CreateCourseModalProps) => {
  const [flow, setFlow] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagName, setTagName] = useState('');
  const [colorTag, setColorTag] = useState(colors[0]);
  const { isOpen: ioPop, onClose: ocPop, onOpen: opPop } = useDisclosure();
  const [tags, setTags] = useState<{ name: string; color: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [language, setLanguage] = useState('');
  const [macroSubject, setMacroSubject] = useState('');
  const [level, setLevel] = useState(3);
  const [topic, setTopic] = useState('');
  const [lessons, setLessons] = useState(1);
  const [duration, setDuration] = useState(1);
  const [bloomLevel, setBloomLevel] = useState(1);
  const [plannedCourse, setPlannedCourse] = useState<Lesson[]>([]);
  const [plannedLesson, setPlannedLesson] = useState<Activity[]>([]);
  const [showScreen, setShowScreen] = useState(2);
  const [finishedCourse, setFinishedCourse] = useState<finishedLesson[]>([]);
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [choosedObjective, setChoosedObjective] = useState(0);
  const [lessonDesctiption, setLessonDesctiption] = useState('');
  const [modalHeader, setModalHeader] = useState("CreateCourse")


  const toast = useToast();

  // reset tags on reopen
  useEffect(() => {
    setColorTag(colors[0]);
    setTags([]);
    setModalHeader("Create Course");
  }, [isOpen]);

  useEffect(() => {
    API.loadFlowList().then((resp) => {
      setSuggestions([...new Set(resp.data.map((flow) => flow.title))]);
    });
  }, [searchValue, API]);

  const createCourse = async () => {
    try {
      setLoading(true);

      const base_course: PolyglotCourseInfo = {
        title: title,
        description: description,
        tags: tags,
      };

      const response: AxiosResponse = await API.createNewCourse(base_course);

      if (response.status !== 201) {
        onClose();
        toast({
          title: 'Course not created',
          description: 'Something is off with your course! Try again',
          status: 'warning',
          duration: 3000,
          position: 'bottom-left',
          isClosable: true,
        });
      }
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
      console.log(error);
      if (error.response.status)
        toast({
          title: 'Server Error',
          description:
            'We are sorry, server was not able to create your course. Error: ' +
            error.response.data.message,
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
      setLoading(false);
      isOpen = false;
      console.log('Course created');
    }
  };

  const planCourse = async () => {
    try {
      setLoading(true);
        const body: PolyglotCourseBody ={
        language: language,
        macroSubject: macroSubject,
        title: topic,
        level: level,
        topic: topic,
        numberOfLessons: lessons,
        lessonDuration: duration
      }
      console.log(body);
      const response: AxiosResponse = await API.planCourse(body);
      setPlannedCourse(response.data.Plan);
      console.log(plannedCourse);
    }catch (error: any) {
      console.log(error);
    }finally {
      setLoading(false);
    }
  };
  
  const handleFinishedLesson = (lesson: rowData[], lessonTitle: string, lessonDescription: string) => {
    const finishedLesson: finishedLesson = {title: lessonTitle, description: lessonDescription, activities: []};
    finishedLesson.activities = lesson.map((activity) => ({
      lessonType: activity.lessonType,
      activityType: activity.activityType,
      timeDuration: activity.timeDuration,
      activityDescription: activity.activityDescription,
    }));
    setFinishedCourse([...finishedCourse, finishedLesson]);
  };

  useEffect(() => {
    console.log(finishedCourse);
  }, [finishedCourse]);

  const generateLearningObjectives = async (lessonTitle: string) => {
    try {
      setLoading(true);
      const body: LOType = {
        Topic: lessonTitle,
        Level: level,
        Context: "",
      }

      const response: AxiosResponse = await API.generateLO(body);
      console.log('LO RESPONSE: ', response.data);
      let learningObjectivesRes: string[] = response.data.Remembering;
      learningObjectivesRes = learningObjectivesRes.concat(response.data.Understanding);
      learningObjectivesRes = learningObjectivesRes.concat(response.data.Applying);
      learningObjectivesRes = learningObjectivesRes.concat(response.data.Analyzing);
      learningObjectivesRes = learningObjectivesRes.concat(response.data.Evaluating);
      learningObjectivesRes = learningObjectivesRes.concat(response.data.Creating);

      setLearningObjectives(learningObjectivesRes);
      console.log(learningObjectivesRes);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const planLesson = async (lesson: Lesson) => {
    try {
      setLoading(true);
      const topics: Topic[] = lesson.Topics.map((topic) => ({
        topic: topic,
        type: 0,
        description: "",
      }));
      const body: PolyglotLessonBody = {
        mainTopics: topics,
        language: language,
        macroSubject: macroSubject,
        title: lesson.Title,
        level: level,
        learningObjective: learningObjectives[choosedObjective],
        bloomLevel: bloomLevel,
        context: "",
        temperature: 0.2
      };
      
      const response: AxiosResponse = await API.planLesson(body);
      const lessonRes: Activity[] = response.data;
      setPlannedLesson(lessonRes);

    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async () => {
    try {
      setLoading(true);
      const body: PolyglotCourseInfo = {
        title: title,
        description: description,
        tags: tags,
      };
      API.saveAICourse(body, finishedCourse);
    }catch (error: any) {
      console.log(error);
    }finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log(level);
  }, [level]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalHeader}</ModalHeader>
        <ModalCloseButton />
        <ModalBody hidden={!(showScreen==1)}>
          <FormControl>
            <FormLabel my={2} fontWeight={'bold'}>
              Title:
            </FormLabel>
            <Input
              placeholder="Insert title..."
              onChange={(e) => {
                e.preventDefault();
                setTitle(e.currentTarget.value);
              }}
            />
            <FormLabel my={2} fontWeight={'bold'}>
              Description:
            </FormLabel>
            <Textarea
              placeholder="Insert description..."
              onChange={(e) => {
                e.preventDefault();
                setDescription(e.currentTarget.value);
              }}
            />
            <Flex paddingTop={'8px'} align={'center'}></Flex>
            <SearchBar
              inputValue={searchValue}
              setInputValue={setSearchValue}
              items={suggestions}
              placeholder="Search learning paths..."
            />
            <Flex paddingTop={'8px'} align={'center'}></Flex>
            <FormLabel my={2} fontWeight={'bold'}>
              Tags:
            </FormLabel>
            <Flex mb={2}>
              <Popover isOpen={ioPop} onClose={ocPop}>
                <PopoverTrigger>
                  <Button
                    colorScheme={colorTag}
                    rounded="md"
                    onClick={opPop}
                    borderWidth={2}
                    borderColor={'gray.300'}
                  />
                </PopoverTrigger>
                <Portal>
                  {/* https://github.com/chakra-ui/chakra-ui/issues/3043 */}
                  <Box
                    zIndex="popover"
                    w="full"
                    h="full"
                    position={'relative'}
                  >
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverHeader>
                        <Text fontWeight={'bold'}>Select Color</Text>
                      </PopoverHeader>
                      <PopoverCloseButton />
                      <PopoverBody>
                        {colors.map((value, id) => (
                          <Button
                            key={id}
                            colorScheme={value}
                            rounded="md"
                            mr={2}
                            mb={2}
                            onClick={() => {
                              setColorTag(value);
                              ocPop();
                            }}
                          />
                        ))}
                      </PopoverBody>
                    </PopoverContent>
                  </Box>
                </Portal>
              </Popover>
              <Tooltip
                label="Press Enter↵ in the input box to add a tag"
                placement="top"
              >
                <Input
                  placeholder="Insert tag name..."
                  w={'40%'}
                  value={tagName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setTags((prev) => {
                        prev.push({
                          name: tagName.toUpperCase(),
                          color: colorTag,
                        });
                        return [...prev];
                      });
                      setTagName('');
                    }
                  }}
                  onChange={(e) => setTagName(e.currentTarget.value)}
                />
              </Tooltip>
              <IconButton
                aria-label="Add Tag"
                disabled={!tagName}
                icon={<AddIcon />}
                rounded="md"
                onClick={() => {
                  setTags((prev) => {
                    prev.push({
                      name: tagName.toUpperCase(),
                      color: colorTag,
                    });
                    return [...prev];
                  });
                  setTagName('');
                }}
              />
            </Flex>

            {tags.map((tag, id) => (
              <Button
                key={id}
                variant={'unstyled'}
                onClick={() =>
                  setTags((prev) => {
                    prev.splice(id, 1);
                    return [...prev];
                  })
                }
              >
                <Tag
                  mr={1}
                  colorScheme={tag.color}
                  fontWeight="bold"
                  h={2}
                >
                  <TagLeftIcon>
                    <CloseIcon />
                  </TagLeftIcon>
                  <TagLabel>{tag.name}</TagLabel>
                </Tag>
              </Button>
            ))}
          </FormControl>
          <Button
            type="submit"
            isLoading={loading}
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              createCourse();
            }}
          >
            Create
          </Button>
        </ModalBody>
        <ModalBody hidden={!(showScreen==2)}>
          <FormControl>
          <FormLabel my={2} fontWeight={'bold'}>
            Title:
          </FormLabel>
          <Input
            placeholder="Insert title..."
            onChange={(e) => {
              e.preventDefault();
              setTitle(e.currentTarget.value);
            }}
          />
          <FormLabel my={2} fontWeight={'bold'}>
            Description:
          </FormLabel>
          <Textarea
            placeholder="Insert description..."
            onChange={(e) => {
              e.preventDefault();
              setDescription(e.currentTarget.value);
            }}
          />
          <FormLabel my={2} fontWeight={'bold'}>
            Language:
          </FormLabel>
          <Input
            placeholder="olny english for now..."
            onChange={(e) => {
              e.preventDefault();
              setLanguage(e.currentTarget.value);
            }}
          />
          <FormLabel my={2} fontWeight={'bold'}>
            Macro subject:
          </FormLabel>
          <Input
            placeholder="Example: Math, Computer Science, etc..."
            onChange={(e) => {
              e.preventDefault();
              setMacroSubject(e.currentTarget.value);
            }}
          />
          <FormLabel my={2} fontWeight={'bold'}>
            Level:
          </FormLabel>
          
          <Select placeholder='Select option' onChange={(event)=>{setLevel(parseInt(event.target.value))}}>
            <option value={1}>primary school</option>
            <option value={2}>middle school</option>
            <option value={3}>high school</option>
            <option value={4}>college</option>
            <option value={5}>academy</option>
          </Select>
          <FormLabel my={2} fontWeight={'bold'}>
            Topic:
          </FormLabel>
          <Input
            placeholder="Example: Algebra, Calculus, etc..."
            onChange={(e) => {
              e.preventDefault();
              setTopic(e.currentTarget.value);
            }}
          />
          <FormLabel my={2} fontWeight={'bold'}>
            Number of lessons:
          </FormLabel>
          <NumberInput defaultValue={2} min={2} clampValueOnBlur={false}
            onChange={(value) => {
              let lessons = parseInt(value);
              if (lessons < 2) lessons = 2;
              setLessons(lessons);
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel my={2} fontWeight={'bold'}>
            lessons duration (in minutes):
          </FormLabel>
          <NumberInput defaultValue={1} min={1} clampValueOnBlur={false}
            onChange={(value) => {
              let duration = parseInt(value);
              if (duration < 1) duration = 1;
              setDuration(duration);
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          </FormControl>
          <Button
            type="submit"
            isLoading={loading}
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              planCourse();
              setShowScreen(3);
            }}
          >
            Plan Course
          </Button>
        </ModalBody>
        <ModalBody hidden={!(showScreen==3)}>
          <TableContainer>
            <Table variant="striped" colorScheme='blue'>
              {plannedCourse.length?(
                <Thead>
                <Tr>
                  <Th>Lesson Title</Th>
                  <Th>Topics</Th>
                </Tr>
              </Thead>
              ):(
                <Thead>
                <Tr>
                  <Th>No Lessons Planned</Th>
                </Tr>
              </Thead>
              )}
              <Tbody>
                {plannedCourse.map((lesson) => (
                  <Tr key={lesson.Title}>
                    <Td style={{ whiteSpace: 'pre-wrap' }}>{lesson.Title}</Td>
                    {lesson.Topics.map((topic) => (
                        <Input defaultValue={topic}
                          key={topic}
                          onChange={(e) => {
                            e.preventDefault();
                            lesson.Topics[lesson.Topics.indexOf(topic)] = e.currentTarget.value;
                            setPlannedCourse([...plannedCourse]);
                            console.log(plannedCourse);
                          }}
                        />
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Button
            type="submit"
            isLoading={loading}
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              generateLearningObjectives(plannedCourse[0].Title);
              setModalHeader(plannedCourse[0].Title);
              setShowScreen(4);
            }}
          >
            next
          </Button>
        </ModalBody>
        {plannedCourse.map((lesson, index) => (
          <ModalBody hidden={!(showScreen==(4 + index * 2))} key={index}>
            <FormControl>
              {/* questo formlabel da un errore in console */}
              <FormLabel fontWeight={'bold'}>
                Chooose a learning objective for {lesson.Title} 
              </FormLabel>
              <Select
                onChange={(e) => {
                  e.preventDefault();
                  console.log(e.currentTarget.selectedIndex);
                  setChoosedObjective(e.currentTarget.selectedIndex);
                  setBloomLevel(Math.round((e.currentTarget.selectedIndex/2)+0.9));
                }}
              >
                {learningObjectives.map((objective) => (
                  <option key={objective} value={objective}>
                    {objective}
                  </option>
                ))}
              </Select>
              <Input
                placeholder="insert leson description..."
                onChange={(e) => {
                  e.preventDefault();
                  setLessonDesctiption(e.currentTarget.value);
                }}
              />
              <Button
                type="submit"
                isLoading={loading}
                loadingText="Creating"
                colorScheme="blue"
                onClick={() => {
                  planLesson(plannedCourse[0]);
                  setShowScreen(showScreen + 1);
                }}
              >
                next
              </Button>
            </FormControl>
          </ModalBody>
        ))}
        {plannedCourse.map((lesson, index) => (
          <ModalBody hidden={!(showScreen==(5 + index * 2))} key={index}>
            {(index != plannedCourse.length-1)?(
              <TableLearningPath
                loading={loading} 
                lesson={{title: lesson.Title, activities: plannedLesson}}
                handleApprovedLesson={(rowData)=>{
                  handleFinishedLesson(rowData, lesson.Title, lessonDesctiption);
                  setShowScreen(showScreen + 1);
                  generateLearningObjectives(plannedCourse[index + 1].Title);
                  setModalHeader(plannedCourse[index + 1].Title)
                }}
              />
            ):(
              <TableLearningPath
                loading={loading}  
                lesson={{title: lesson.Title, activities: plannedLesson}}
                handleApprovedLesson={(rowData)=>{
                  handleFinishedLesson(rowData, lesson.Title, lessonDesctiption);
                  setShowScreen(showScreen + 1);
                  setModalHeader("Save Course");
                }}
              />
            )}
          </ModalBody>
        ))}
          <ModalBody hidden={!(showScreen==plannedCourse.length*2+4)}>
            <FormLabel>
              <Button
                onClick={saveCourse}
              >
                save course to database
              </Button>
              <Button>
                download course syllabus as pdf
              </Button>
            </FormLabel>
          </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateCourseModal;
