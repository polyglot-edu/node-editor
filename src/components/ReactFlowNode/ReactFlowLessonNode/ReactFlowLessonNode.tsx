import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import useStore from '../../../store';
import { LessonNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowLessonNodeProps = ReactFlowNodeProps & LessonNode;

const ReactFlowLessonNode = ({ id }: ReactFlowLessonNodeProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);
  const theme = useTheme();

  return (
    <Card
      className="Card-react-flow"
      style={{
        borderColor: theme.palette.purple,
        background: `${theme.palette.purple}08`,
      }}
    >
      {label}
      <Handle type="source" position={Position.Right} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default ReactFlowLessonNode;
