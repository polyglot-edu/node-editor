import { AddIcon, CloseIcon } from '@chakra-ui/icons';
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
  Tag,
  TagLabel,
  TagLeftIcon,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  PolyglotFlow,
  PolyglotFlowInfo,
  TagOptions,
  TagTypes,
} from '../../types/polyglotElements';

type EditFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  flow: Nullable<PolyglotFlow>;
  updateInfo: (flowInfo: PolyglotFlowInfo) => void;
};

const defaultTagOpts = Object.keys(TagOptions).map((index) => {
  return {
    value: index as TagTypes,
    ...TagOptions[index as TagTypes],
    selected: false,
  };
});

const EditFlowModal = ({
  isOpen,
  onClose,
  flow,
  updateInfo,
}: EditFlowModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  console.log(defaultTagOpts);
  const [tags, setTags] =
    useState<{ selected: boolean; color: string; value: TagTypes }[]>();

  useEffect(() => {
    if (!flow) return;
    setTitle(flow.title);
    setDescription(flow.description);
    setTags(
      defaultTagOpts.map((defTag) => {
        console.log('test');
        defTag.selected =
          flow.tags.findIndex((tag) => tag === defTag.value) !== -1;
        return defTag;
      })
    );
  }, [flow]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Flow</ModalHeader>
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
          <FormLabel my={2} fontWeight={'bold'}>
            Click on the tags to add them:
          </FormLabel>

          {tags?.map((tag, id) => (
            <Button
              key={id}
              variant="unstyled"
              onClick={() => {
                setTags((prev) => {
                  if (!prev) return prev;
                  prev[id].selected = !prev[id].selected;
                  return [...prev];
                });
              }}
            >
              <Tag
                mr={1}
                colorScheme={tag.color}
                fontWeight="bold"
                h={2}
                variant={tag.selected ? 'outline' : 'subtle'}
              >
                <TagLeftIcon
                  boxSize="12px"
                  as={tag.selected ? CloseIcon : AddIcon}
                />
                <TagLabel>{tag.value}</TagLabel>
              </Tag>
            </Button>
          ))}
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              if (!title || !description || !tags) return;
              updateInfo({
                title: title,
                description: description,
                tags: tags.reduce<TagTypes[]>((filtered, opt) => {
                  if (opt.selected) filtered.push(opt.value);
                  return filtered;
                }, []),
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

export default EditFlowModal;
