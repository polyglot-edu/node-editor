import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { API } from '../../data/api';
import useStore from '../../store';
import { Metadata } from '../../types/metadata';
import DynamicForm, {
  OnChangeDynamicForm,
  parseMetaField,
} from '../Forms/DynamicForm';
import Panel from '../Layout/Panel';

export type ElementPropertiesProps = {
  meta?: Metadata;
  autoFetchMeta?: boolean;
  children?: React.ReactNode;
  hidden?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
};

const ElementProperties = ({
  isOpen,
  children,
  autoFetchMeta = true,
  meta,
}: ElementPropertiesProps) => {
  const {
    selectedElement: seMeta,
    getSelectedElement,
    updateNode,
    updateEdge,
  } = useStore();

  const {
    isOpen: editorOpen,
    onOpen: onEditorOpen,
    onClose: onEditorClose,
  } = useDisclosure();

  const selectedElement = getSelectedElement();

  const [nodeMeta, setNodeMeta] = useState<any>();
  const [edgeMeta, setEdgeMeta] = useState<any>();

  useEffect(() => {
    if (autoFetchMeta) {
      API.generalNodeMetadata().then((res) => {
        setNodeMeta(res.data);
      });

      API.generalEdgeMetadata().then((res) => {
        setEdgeMeta(res.data);
      });
    }
  }, [autoFetchMeta, selectedElement]);

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
        {selectedElement && nodeMeta && (
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

    let update: any = {};
    if (metaField.name === 'title') {
      update = {
        reactFlow: {
          data: {
            label: value,
          },
        },
      };
    }
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
