import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import Summary_icon from '../../../public/abstract_icon.png';
import useStore from '../../../store';
import { SummaryNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowSummaryNodeProps = ReactFlowNodeProps & SummaryNode;

const ReactFlowSummaryNode = ({ id }: ReactFlowSummaryNodeProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);
  const theme = useTheme();

  return (
    <Card className="Card-react-flow">
      <img
        src={Summary_icon.src}
        width="20"
        height="20"
        style={{ float: 'left', marginTop: '2px', marginRight: '5px' }}
      />
      {label}
      <Handle
        type="source"
        position={Position.Right}
        onConnect={onConnect}
        style={{
          background: '#FFCC49',
          height: '25px',
          width: '5px',
          borderRadius: '0px',
          border: '0px',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#FFCC49',
          height: '25px',
          width: '5px',
          borderRadius: '0px',
          border: '0px',
        }}
      />
    </Card>
  );
};

export default ReactFlowSummaryNode;
