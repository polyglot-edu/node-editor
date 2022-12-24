import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import useStore, { changeEdgeType, changeNodeType } from '../../store';
import { GeneralMetadata, Metadata } from '../../types/metadata';
import { PolyglotEdge, PolyglotNode } from '../../types/polyglotElements';
import DynamicForm, {
  OnChangeDynamicForm,
  parseMetaField,
} from '../Forms/DynamicForm';
import Panel from '../Layout/Panel';

export type ElementPropertiesProps = {
  selectedElement: PolyglotNode | PolyglotEdge | undefined;
  meta?: Metadata;
  autoFetchMeta?: boolean;
  children?: React.ReactNode;
  hidden?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
};

const ElementProperties = ({
  selectedElement,
  isOpen,
  children,
  autoFetchMeta = true,
  meta,
}: ElementPropertiesProps) => {
  const { selectedElement: seMeta, updateNode, updateEdge } = useStore();

  const {
    isOpen: editorOpen,
    onOpen: onEditorOpen,
    onClose: onEditorClose,
  } = useDisclosure();

  const [nodeMeta, setNodeMeta] = useState<GeneralMetadata>();
  const [edgeMeta, setEdgeMeta] = useState<GeneralMetadata>();

  useEffect(() => {
    if (autoFetchMeta) {
      // API.generalNodeMetadata().then((res) => {
      //   setNodeMeta(res.data);
      // });
      setNodeMeta(nm as GeneralMetadata);

      // API.generalEdgeMetadata().then((res) => {
      //   setEdgeMeta(res.data);
      // });
      setEdgeMeta(em as GeneralMetadata);
    }
  }, [autoFetchMeta]);

  return (
    <Panel isOpen={isOpen}>
      <Heading size="lg" mb={5}>
        Properties:
      </Heading>
      <Box hidden={!editorOpen} h="full" overflow={'hidden'}>
        <Button mb="2" onClick={onEditorClose}>
          Return
        </Button>
        <Editor
          options={{
            readOnly: true,
          }}
          height="80%"
          language="json"
          value={JSON.stringify(selectedElement, null, 4) ?? ''}
        />
      </Box>
      <Box hidden={editorOpen}>
        <Button mb="2" onClick={onEditorOpen}>
          Edit Code
        </Button>
        {selectedElement && nodeMeta && edgeMeta && (
          <DynamicForm
            metadata={
              meta ||
              (seMeta?.type === 'Node'
                ? nodeMeta[selectedElement.type]
                : edgeMeta[selectedElement.type])
            }
            onChange={onChangeElement}
            onChangeProps={{
              updateElement: seMeta?.type === 'Node' ? updateNode : updateEdge,
              changeType:
                seMeta?.type === 'Node' ? changeNodeType : changeEdgeType,
            }}
            element={selectedElement}
          />
        )}
        {children}
      </Box>
    </Panel>
  );
};

const onChangeElement: OnChangeDynamicForm =
  (element, metaField, props, parentKey) => (e) => {
    if (!element) return;

    const { id: elementID } = element.reactFlow;

    const value = parseMetaField(
      metaField,
      element,
      e.currentTarget?.value,
      e.currentTarget?.name,
      parentKey
    );

    if (!value) {
      if (metaField.name === 'type')
        return props?.changeType(element, e?.currentTarget?.value ?? '');
    }

    let update: any = {};
    if (metaField.name === 'type') {
      update = {
        reactFlow: {
          type: value,
        },
      };
    }
    if (parentKey) {
      update[parentKey] = {};
      update[parentKey][metaField.name] = value;
    } else {
      update[metaField.name] = value;
    }

    props?.updateElement(elementID, update);
  };

export default ElementProperties;

const nm = {
  abstractNode: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'string',
          name: 'target',
          label: 'Target',
          constraints: {},
        },
      ],
    },
    {
      type: 'enum',
      name: 'difficulty',
      label: 'Difficulty',
      constraints: {},
      sub: 'number',
      options: [1, 2, 3, 4, 5],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'abstractNode',
        'closeEndedQuestionNode',
        'codingQuestionNode',
        'lessonNode',
        'lessonTextNode',
        'multipleChoiceQuestionNode',
      ],
      constraints: {},
    },
  ],
  closeEndedQuestionNode: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'markdown',
          name: 'question',
          label: 'Question',
          constraints: {},
        },
        {
          type: 'array',
          name: 'correctAnswers',
          label: 'Correct Answers',
          constraints: {},
          sub: 'string',
        },
      ],
    },
    {
      type: 'enum',
      name: 'difficulty',
      label: 'Difficulty',
      constraints: {},
      sub: 'number',
      options: [1, 2, 3, 4, 5],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'abstractNode',
        'closeEndedQuestionNode',
        'codingQuestionNode',
        'lessonNode',
        'lessonTextNode',
        'multipleChoiceQuestionNode',
      ],
      constraints: {},
    },
  ],
  codingQuestionNode: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'markdown',
          name: 'question',
          label: 'Question',
          constraints: {},
        },
        {
          type: 'code',
          name: 'codeTemplate',
          label: 'Template code',
          constraints: {},
        },
        {
          type: 'enum',
          name: 'language',
          label: 'Language',
          constraints: {},
          sub: 'string',
          options: ['csharp', 'sysml'],
        },
      ],
    },
    {
      type: 'enum',
      name: 'difficulty',
      label: 'Difficulty',
      constraints: {},
      sub: 'number',
      options: [1, 2, 3, 4, 5],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'abstractNode',
        'closeEndedQuestionNode',
        'codingQuestionNode',
        'lessonNode',
        'lessonTextNode',
        'multipleChoiceQuestionNode',
      ],
      constraints: {},
    },
  ],
  lessonNode: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'file',
          name: 'file',
          label: 'File',
          constraints: {},
        },
      ],
    },
    {
      type: 'enum',
      name: 'difficulty',
      label: 'Difficulty',
      constraints: {},
      sub: 'number',
      options: [1, 2, 3, 4, 5],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'abstractNode',
        'closeEndedQuestionNode',
        'codingQuestionNode',
        'lessonNode',
        'lessonTextNode',
        'multipleChoiceQuestionNode',
      ],
      constraints: {},
    },
  ],
  lessonTextNode: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'markdown',
          name: 'text',
          label: 'Text',
          constraints: {},
        },
      ],
    },
    {
      type: 'enum',
      name: 'difficulty',
      label: 'Difficulty',
      constraints: {},
      sub: 'number',
      options: [1, 2, 3, 4, 5],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'abstractNode',
        'closeEndedQuestionNode',
        'codingQuestionNode',
        'lessonNode',
        'lessonTextNode',
        'multipleChoiceQuestionNode',
      ],
      constraints: {},
    },
  ],
  multipleChoiceQuestionNode: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'markdown',
          name: 'question',
          label: 'Question',
          constraints: {},
        },
        {
          type: 'multiple_choice',
          name: 'choices',
          label: 'Choices',
          constraints: {},
          sub: 'string',
        },
        {
          type: 'array',
          name: 'isChoiceCorrect',
          label: '',
          constraints: {},
          sub: 'boolean',
        },
      ],
    },
    {
      type: 'enum',
      name: 'difficulty',
      label: 'Difficulty',
      constraints: {},
      sub: 'number',
      options: [1, 2, 3, 4, 5],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'abstractNode',
        'closeEndedQuestionNode',
        'codingQuestionNode',
        'lessonNode',
        'lessonTextNode',
        'multipleChoiceQuestionNode',
      ],
      constraints: {},
    },
  ],
};

const em = {
  customValidationEdge: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'code',
          name: 'code',
          label: 'Code',
          constraints: {},
        },
      ],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'customValidationEdge',
        'exactValueEdge',
        'passFailEdge',
        'unconditionalEdge',
      ],
      constraints: {},
    },
  ],
  exactValueEdge: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'string',
          name: 'value',
          label: 'Value',
          constraints: {},
        },
      ],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'customValidationEdge',
        'exactValueEdge',
        'passFailEdge',
        'unconditionalEdge',
      ],
      constraints: {},
    },
  ],
  passFailEdge: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [
        {
          type: 'enum',
          name: 'conditionKind',
          label: 'Condition Kind',
          constraints: {},
          sub: 'string',
          options: ['pass', 'fail'],
        },
      ],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'customValidationEdge',
        'exactValueEdge',
        'passFailEdge',
        'unconditionalEdge',
      ],
      constraints: {},
    },
  ],
  unconditionalEdge: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      constraints: {},
    },
    {
      type: 'any',
      name: 'data',
      constraints: {},
      fields: [],
    },
    {
      type: 'enum',
      sub: 'string',
      name: 'type',
      label: 'Type',
      options: [
        'customValidationEdge',
        'exactValueEdge',
        'passFailEdge',
        'unconditionalEdge',
      ],
      constraints: {},
    },
  ],
};
