import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  HStack,
  Image,
  LinkBox,
  List,
  ListIcon,
  ListItem,
  SpaceProps,
  Spacer,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import cardImage from '../../public/test_card.png';
import { PolyglotCourse } from '../../types/polyglotElements';
import FlowCard from './FlowCard';

type CourseCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  canDelete?: boolean;
  canEdit?: boolean;
  canEnroll?: boolean;
  isSubscribed?: boolean;
  setSelected?: (courseId: string) => void;
  setOpenModal?: (modal: string) => void;
  onEnroll?: (courseId: string) => void;
  course: PolyglotCourse;
};

const CourseCard = ({
  course,
  px,
  py,
  canDelete,
  canEdit,
  canEnroll,
  setSelected,
  setOpenModal,
  onEnroll,
}: CourseCardProps) => {
  return (
    <LinkBox px={px} py={py}>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: '100%', sm: '200px' }}
          src={cardImage.src}
          alt="Flow card"
        />

        <Stack w="full">
          <CardBody>
            <Flex float={'right'}>
              {canEdit && (
                <Button
                  zIndex={11}
                  float={'right'}
                  variant="unstyled"
                  hidden={!canEdit}
                >
                  <Tooltip label="Edit" placement="left">
                    <EditIcon
                      onClick={() => {
                        setSelected?.(course._id!);
                        setOpenModal?.('edit');
                      }}
                      w={5}
                      h={5}
                      color="blue"
                    />
                  </Tooltip>
                </Button>
              )}
              {canDelete && (
                <Button
                  zIndex={11}
                  float={'right'}
                  variant="unstyled"
                  hidden={!canDelete}
                >
                  <Tooltip label="Delete" placement="right">
                    <DeleteIcon
                      onClick={() => {
                        setSelected?.(course._id!);
                        setOpenModal?.('delete');
                      }}
                      w={5}
                      h={5}
                      color="red"
                    />
                  </Tooltip>
                </Button>
              )}
              <Button
                zIndex={11}
                colorScheme="blue"
                size={'sm'}
                variant="solid"
                hidden={!canEnroll}
                onClick={() => onEnroll?.(course._id!)}
              >
                enroll
              </Button>
            </Flex>
            <Heading size="md">{course.title}</Heading>
            {course.tags &&
              course.tags.map((tag, id) => (
                <Badge key={id} mr={1} colorScheme={tag.color}>
                  {tag.name}
                </Badge>
              ))}
            <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
              {course.description}
            </Text>
            <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
              In this Course there are: {course.flows.length} learning paths
            </Text>
            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Course flows
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <List spacing={3}>
                    {course.flows.map((flow, id) => (
                      <ListItem key={id}>
                        <ListIcon as={MdCheckCircle} color="green.500" />
                        {flow.title}
                      </ListItem>
                    ))}
                    {course.flows.map((flow, id) => (
                      <ListItem key={id}>
                        <FlowCard flow={flow} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </CardBody>

          <CardFooter>
            {!canDelete && (
              <>
                <Spacer />
                <HStack pl={5} spacing="2" align="center" h="full">
                  <Text fontSize={'xs'}>{course.author?.username}</Text>
                  <Avatar name={course.author?.username} size="sm" />
                </HStack>
              </>
            )}
          </CardFooter>
        </Stack>
      </Card>
    </LinkBox>
  );
};

export default CourseCard;

export function ScheletonCourseCard() {
  return (
    <div className="animate-pulse bg-gray-300 w-2/3 h-12 p-3 rounded"></div>
  );
}
