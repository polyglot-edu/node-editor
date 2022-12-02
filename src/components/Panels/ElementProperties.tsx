import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'react';
import { APIV2 } from '../../data/api';
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
  const API = useMemo(() => new APIV2(), []);

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
      API.generalNodeMetadata().then((res) => {
        setNodeMeta(res.data);
      });

      API.generalEdgeMetadata().then((res) => {
        setEdgeMeta(res.data);
      });
    }
  }, [API, autoFetchMeta]);

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
