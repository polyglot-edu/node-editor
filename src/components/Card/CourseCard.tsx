import { DeleteIcon } from '@chakra-ui/icons';
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
  HStack,
  Heading,
  Image,
  LinkBox,
  List,
  ListIcon,
  ListItem,
  SpaceProps,
  Spacer,
  Stack,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { MdCheckCircle } from "react-icons/md";
import cardImage from '../../public/test_card.png';
import { PolyglotCourse } from '../../types/polyglotElements';

type CourseCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  canDelete?: boolean;
  canEdit?: boolean;
  isSubscribed?: boolean;
  setSelected?: (courseId: string) => void;
  course: PolyglotCourse;
};

const CourseCard = ({ course, px, py, canDelete, setSelected }: CourseCardProps) => {
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
            {canDelete && (
              <Button
                zIndex={11}
                position="absolute"
                top={4}
                right={5}
                variant="unstyled"
              >
                <Tooltip label="Delete" placement="right">
                  <DeleteIcon
                    onClick={() => setSelected?.(course._id!)}
                    w={5}
                    h={5}
                    color="red"
                  />
                </Tooltip>
              </Button>
            )}
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
              In this Course there are: {course.flows.length} learning
              paths
            </Text>
            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      Course flows
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                <List spacing={3}>
                  {
                    course.flows.map((flow, id) => (
                      <ListItem key={id}>
                        <ListIcon as={MdCheckCircle} color='green.500' />
                        {flow.title}
                      </ListItem>
                    ))
                  }
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
