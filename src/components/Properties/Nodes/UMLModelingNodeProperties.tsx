import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../../data/api';
import {
  PapyAssignment,
  PapyTag,
} from '../../../types/polyglotElements/PapyrusTypes/PapyrusTypes';
import TextField from '../../Forms/Fields/TextField';
import { colors } from '../../Modals/CreateFlowModal';
import NodeProperties from './NodeProperties';
type AssignmentProjectsList = PapyAssignment[];

const UMLModelingNodeProperties = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [projectsList, setProjectsList] = useState<AssignmentProjectsList>();
  const { getValues, setValue } = useFormContext();
  const { isOpen: ioPop, onClose: ocPop, onOpen: opPop } = useDisclosure();
  const [mode, setMode] = useState<string>('Default');
  const [assignemntText, setAssignemntText] = useState<string>(
    getValues('data.assignment')
  );
  const [tags, setTags] = useState<PapyTag[]>(getValues('data.tags') || []);
  const [colorTag, setColorTag] = useState(colors[0]);
  const [tagName, setTagName] = useState('');

  useEffect(() => {
    API.getAssignmentProjects()
      .then(async (response) => {
        console.log(response.data);
        setProjectsList(response.data);
        setMode(getValues('data.mode'));
      })
      .catch(async (error: any) => {
        console.log(error);
      });
  }, [API]);

  return (
    <>
      <NodeProperties
        platform={['PapyrusWeb']}
        activityDescription="In this activity learners will have solve an assignment of UML class activity."
      />

      <Button
        hidden={mode == 'Default'}
        onClick={() => {
          setMode('Default');
          setValue('data.mode', 'Default');
        }}
        bgColor={'blue.300'}
      >
        Default
      </Button>
      <Button
        hidden={mode == 'Custom'}
        onClick={() => {
          setMode('Custom');
          setValue('data.mode', 'Custom');
        }}
        bgColor={'blue.200'}
      >
        Custom
      </Button>

      <Box
        hidden={mode != 'Default'}
        margin={'2'}
        border={'solid'}
        borderColor={'grey'}
        borderRadius={'8px'}
        borderWidth={'1px'}
        padding={'5px'}
      >
        Select the assignment:
        <Select
          onChange={(event) => {
            console.log(event.target.value);
            const project = projectsList?.find(
              (value) => value.projectId == event.target.value
            );
            if (!project) return;
            console.log(project);
            setAssignemntText(project.assignmentText);
            setTags(project.tags);
            if (project.tags != null) {
              setTags(project.tags);
              setValue('data.tags', project.tags);
            } else {
              setTags([{ name: 'no tag defined', color: 'grey', _id: '1' }]);
              setValue('data.tags', [
                { name: 'no tag defined', color: 'grey', _id: '1' },
              ]);
            }
            console.log();
            setValue('data.assignment', project.assignmentText);
            setValue('data.title', project.assignmentTitle);
            setValue('data.idUML', project.projectId);
            setValue('data.projectUML', project.projectId);
          }}
        >
          {projectsList?.map((item, index) => {
            return (
              <>
                <option
                  key={index}
                  value={item.projectId}
                  selected={item.projectId == getValues('data.idUML')}
                >
                  {item.assignmentTitle}
                </option>
              </>
            );
          })}
        </Select>
        <Box marginTop={'10px'}>
          Assignment text: <br />
          {assignemntText}
        </Box>
        <Box marginTop={'10px'}>
          Tags: <br />
          {tags.map((tag, id) => (
            <Button key={id} variant={'unstyled'}>
              <Tag mr={1} colorScheme={tag.color} fontWeight="bold" h={2}>
                <TagLabel>{tag.name}</TagLabel>
              </Tag>
            </Button>
          ))}
        </Box>
      </Box>
      <Box
        hidden={mode != 'Custom'}
        margin={'2'}
        border={'solid'}
        borderColor={'grey'}
        borderRadius={'8px'}
        borderWidth={'1px'}
        padding={'5px'}
      >
        <Button
          /*hidden={
            getValues('data.idUML') != '' &&
            !projectsList?.find(
              (value) => value.projectId == getValues('data.idUML')
            )
          }*/
          onClick={() => {
            setLoading(true);
            console.log('generate project');
            const id = (Math.random() + 1).toString(36).substring(7);
            API.generateNewProject({
              nomeUtente: id,
            })
              .then(async (response) => {
                console.log(response.data);
                setValue('data.idUML', response.data.project_id);
                setValue('data.projectUML', response.data.representation_id);
                setValue('data.assignment', '');
                setValue('data.title', '');
                setLoading(false);
              })
              .catch(async (error: any) => {
                setLoading(false);
                console.log(error);
              });
          }}
          isLoading={loading}
        >
          Create project
        </Button>
        <Box
          hidden={
            getValues('data.idUML') == ''
            //&&
            //projectsList?.find(
            //  (value) => value.projectId == getValues('data.idUML')
            //) != undefined
          }
        >
          <Box>
            Click to open our UML modeling platform to define your custom
            exercise
          </Box>
          <Button
            marginBottom={'6px'}
            disabled={
              getValues('data.idUML') != '' &&
              projectsList?.find(
                (value) => value.projectId == getValues('data.idUML')
              ) != undefined
            }
            onClick={() => {
              window.open(
                'https://papygame.tech/projects/' +
                  getValues('data.idUML') +
                  '/edit/' +
                  getValues('data.projectUML'),
                '_blank'
              );
            }}
          >
            PapyrusWeb
          </Button>
          <TextField label="Assignment" name="data.assignment" />
          <TextField label="Title" name="data.title" />
          <FormLabel my={2} fontWeight={'bold'}>
            Click on the tags to add them:
          </FormLabel>
          <Flex>
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
                <Box>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>
                      <Box fontWeight={'bold'}>Select Color</Box>
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
                        _id: '1',
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
                    _id: '1',
                  });
                  return [...prev];
                });
                setValue('data.tags', tags);
                console.log(getValues('data.tags'));
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
              <Tag mr={1} colorScheme={tag.color} fontWeight="bold" h={2}>
                <TagLeftIcon>
                  <CloseIcon />
                </TagLeftIcon>
                <TagLabel>{tag.name}</TagLabel>
              </Tag>
            </Button>
          ))}
          <br />
          <Button
            marginTop={'10px'}
            onClick={() => {
              setLoading(true);
              if (
                getValues('data.title') == '' ||
                getValues('data.title') == undefined
              ) {
                toast({
                  title: 'Missing title',
                  description:
                    'The title is required, insert it before generating the assignment.',
                  status: 'error',
                  duration: 4000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                return;
              }
              if (
                getValues('data.assignment') == '' ||
                getValues('data.assignment') == undefined
              ) {
                toast({
                  title: 'Missing assignment',
                  description:
                    'The assignment text is required, insert it before generating the assignment.',
                  status: 'error',
                  duration: 4000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                return;
              }
              API.generateNewAssignment({
                project_id: getValues('data.idUML'),
                assignment_text: getValues('data.assignment'),
                assignment_title: getValues('data.title'),
                tags: getValues('data.tags') || [],
              })
                .then(async (response: any) => {
                  console.log(response.data);
                  toast({
                    title: 'Publication complete',
                    description: 'Assignment publicated correctly!',
                    status: 'success',
                    duration: 4000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  setLoading(false);
                })
                .catch(async (error: any) => {
                  setLoading(false);
                  toast({
                    title: 'Error in publication',
                    description: 'Internal service error: ' + error,
                    status: 'error',
                    duration: 4000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                });
            }}
            isLoading={loading}
          >
            Publish assignment
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default UMLModelingNodeProperties;
