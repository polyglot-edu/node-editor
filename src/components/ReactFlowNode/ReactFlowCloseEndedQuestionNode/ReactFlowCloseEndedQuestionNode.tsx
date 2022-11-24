import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import useStore from '../../../store';
import { CloseEndedQuestionNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowCloseEndedQuestionNodeProps = ReactFlowNodeProps &
  CloseEndedQuestionNode;

const ReactFlowCloseEndedQuestionNode = ({
  id,
}: ReactFlowCloseEndedQuestionNodeProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);
  const theme = useTheme();

  return (
    <Card
      className="Card-react-flow"
      style={{
        borderColor: theme.palette.orangeLight,
        background: `${theme.palette.orangeLight}08`,
      }}
    >
      {label}
      <Handle type="source" position={Position.Right} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default ReactFlowCloseEndedQuestionNode;
