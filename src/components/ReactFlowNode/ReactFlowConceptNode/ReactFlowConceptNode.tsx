import { Handle, Position } from 'reactflow';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowConceptNodeProps = ReactFlowNodeProps;

const ReactFlowConceptNode = ({ data }: ReactFlowConceptNodeProps) => {
  const { label } = data;

  return (
    <div
      style={{
        border: 'solid black 1px',
        borderRadius: '5px',
        background: `orange`,
        padding: '10px',
      }}
    >
      {label}
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    </div>
  );
};

export default ReactFlowConceptNode;
