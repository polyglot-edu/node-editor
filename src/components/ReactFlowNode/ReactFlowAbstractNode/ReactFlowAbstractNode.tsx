import { Handle, Position } from 'reactflow';
import icon from '../../../public/abstract_icon.png';
import useStore from '../../../store';
import { AbstractNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowAbstractNodeProps = ReactFlowNodeProps & AbstractNode;

const ReactFlowAbstractNode = ({ id }: ReactFlowAbstractNodeProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);

  return (
    <Card className="Card-react-flow">
      <img
        src={icon.src}
        width="25"
        height="25"
        style={{ float: 'left', marginTop: '-2px' }}
      />

      {label}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#FFCC49',
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

export default ReactFlowAbstractNode;
