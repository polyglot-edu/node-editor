import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  PolyglotCourse,
  PolyglotCourseInfo,
} from '../../types/polyglotElements';
import { colors } from './CreateCourseModal';

export type EditCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course: PolyglotCourse;
  courseId: string;
  updateInfo: (courseId: string, courseInfo: PolyglotCourseInfo) => void;
};

const EditCourseModal = ({
  isOpen,
  onClose,
  course,
  courseId,
  updateInfo,
}: EditCourseModalProps) => {
  //if (!course.topics) flow.topics = [];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  //const [toplllls, setTopics] = useState([...course.topics]);
  const [tagName, setTagName] = useState('');
  const [publish] = useState(false);
  const [colorTag, setColorTag] = useState(colors[0]);
  //const [tags, setTags] = useState([...course.tags]);
  const { isOpen: ioPop, onClose: ocPop, onOpen: opPop } = useDisclosure();

  useEffect(() => {
    if (!course) return;
    setTitle(course.title);
    setDescription(course.description);
    //setTopics([...flow.topics]);
    setColorTag(colors[0]);
    //setTags([...flow.tags]);
  }, [course]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Course</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel mb={2} fontWeight={'bold'}>
              Title:
            </FormLabel>
            <Input
              placeholder="Insert title..."
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <FormLabel mb={2} fontWeight={'bold'}>
              Description:
            </FormLabel>
            <Textarea
              placeholder="Insert description..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              if (!title || !description) return;
              updateInfo(courseId, {
                title: title,
                description: description,
              });
              onClose();
            }}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCourseModal;
