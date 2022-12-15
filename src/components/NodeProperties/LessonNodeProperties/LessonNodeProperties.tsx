import {
  DocumentCard,
  DocumentCardDetails,
  DocumentCardImage,
  DocumentCardTitle,
  ImageFit,
  Label,
  PrimaryButton,
  Separator,
  Stack,
  StackItem,
  Text,
} from '@fluentui/react';
import produce from 'immer';
import useStore from '../../../store';
import { LessonNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { NodePropertiesProps } from '../NodeProperties';

export type LessonNodePropertiesProps = NodePropertiesProps & {};

const LessonNodeProperties = () => {
  const selectedNode = useStore((state) =>
    state.getSelectedNode()
  ) as LessonNode;
  const updateNode = useStore((state) => state.updateNode);

  const { id } = selectedNode.reactFlow;

  function onFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const newLessonNode = produce(selectedNode, (draft) => {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];
        draft.data.file = {
          name: file.name,
          // preview: URL.createObjectURL(file),
        };
      }
    });

    updateNode(id, newLessonNode);
  }

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <StackItem>
        <Card className="flex flex-col">
          <Label>Lesson File</Label>
          <Separator />
          {selectedNode.data.file ? (
            <DocumentCard className="self-center w-2/3">
              <DocumentCardImage
                height={150}
                imageFit={ImageFit.center}
                iconProps={{
                  iconName: 'PDF',
                  styles: {
                    root: { fontSize: '90px', width: '90px', height: '90px' },
                  },
                }}
              />
              <DocumentCardDetails>
                <DocumentCardTitle
                  title={selectedNode.data.file.name}
                  shouldTruncate
                />
              </DocumentCardDetails>
            </DocumentCard>
          ) : (
            <Text className="text-center">No file selected yet</Text>
          )}

          <PrimaryButton className="mt-4 self-center w-1/2 p-0">
            <label className="w-full h-full flex flex-col justify-center">
              <span className="self-center">
                {' '}
                {selectedNode.data.file ? 'Change file' : 'Upload file'}
              </span>
              <input
                className="sr-only w-full h-full"
                type="file"
                accept=".pdf"
                onChange={onFilePick}
              />
            </label>
          </PrimaryButton>
        </Card>
      </StackItem>
    </Stack>
  );
};

export default LessonNodeProperties;
