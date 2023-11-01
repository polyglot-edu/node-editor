import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import ImageEvaluation_icon from '../../../public/abstract_icon.png';
import useStore from '../../../store';
import { ImageEvaluationNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowImageEvaluationNodeProps = ReactFlowNodeProps &
  ImageEvaluationNode;

const ReactFlowImageEvaluationNode = ({
  id,
}: ReactFlowImageEvaluationNodeProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);
  const theme = useTheme();

  return (
    <Card className="Card-react-flow">
      <img
        src={ImageEvaluation_icon.src}
        width="20"
        height="20"
        style={{ float: 'left', marginTop: '2px', marginRight: '5px' }}
      />
      {label}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#3B1D5C',
          height: '25px',
          width: '5px',
          borderRadius: '0px',
          border: '0px',
        }}
        onConnect={onConnect}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#3B1D5C',
          height: '25px',
          width: '5px',
          borderRadius: '0px',
          border: '0px',
        }}
      />
    </Card>
  );
};

export default ReactFlowImageEvaluationNode;
