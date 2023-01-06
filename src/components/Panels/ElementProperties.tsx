import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';
import useStore from '../../store';
import {
  PolyglotEdge,
  polyglotEdgeComponentMapping,
  PolyglotNode,
  polyglotNodeComponentMapping,
} from '../../types/polyglotElements';
import { useHasHydrated } from '../../utils/utils';
import Panel from '../Layout/Panel';

export type ElementPropertiesProps = {
  selectedElement: PolyglotNode | PolyglotEdge | undefined;
  children?: React.ReactNode;
  isOpen?: boolean;
};

const updateForm = (input: any, methods: UseFormReturn<FieldValues, any>) => {
  Object.keys(input).forEach((index) => {
    // TODO extend this controll to general json obj
    if (index === 'data') {
      Object.keys(input[index]).forEach((v) => {
        methods.setValue('data.' + v, input[index][v]);
        return;
      });
    }
    methods.setValue(index, input[index]);
  });
};

const compareElements = (first: any, second: any) => {
  if (!first || !second) return false;
  const tmp1 = JSON.parse(JSON.stringify(first));
  const tmp2 = JSON.parse(JSON.stringify(second));

  delete tmp1.reactFlow;
  delete tmp2.reactFlow;

  delete tmp1.code;
  delete tmp2.code;

  delete tmp1.runtimeData;
  delete tmp2.runtimeData;

  return JSON.stringify(tmp1) !== JSON.stringify(tmp2);
};

const ElementProperties = ({
  selectedElement,
  isOpen,
  children,
}: ElementPropertiesProps) => {
  const {
    isOpen: editorOpen,
    onOpen: onEditorOpen,
    onClose: onEditorClose,
  } = useDisclosure();

  const hydrated = useHasHydrated();

  const methods = useForm({ mode: 'all' });
  const watchAll = useWatch({
    control: methods.control,
  });
  const watchRef = useRef<{ [x: string]: any } | null>(watchAll);

  const [updateElement, updateFactor] = useStore((store) => [
    store.updateElement,
    store.currentAction,
  ]);

  if (JSON.stringify(watchAll) !== JSON.stringify(watchRef.current)) {
    watchRef.current = watchAll;
  }

  useEffect(() => {
    methods.clearErrors();
    methods.reset();
  }, [selectedElement?._id]);

  useEffect(() => {
    if (!selectedElement) return;
    updateForm(selectedElement, methods);
  }, [selectedElement?._id, updateFactor]);

  useEffect(() => {
    if (JSON.stringify(watchAll) === '{}') return;
    // deep copy
    const node = JSON.parse(JSON.stringify(watchAll));
    console.log(watchRef.current);
    if (compareElements(node, selectedElement)) updateElement(node);
  }, [watchAll]);

  const ElementProperty = selectedElement?.type.includes('Node')
    ? polyglotNodeComponentMapping.getElementPropertiesComponent(
        selectedElement?.type
      )
    : polyglotEdgeComponentMapping.getElementPropertiesComponent(
        selectedElement?.type
      );

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
        <FormProvider {...methods}>
          {hydrated && <ElementProperty />}
        </FormProvider>

        {children}
      </Box>
    </Panel>
  );
};

export default ElementProperties;
