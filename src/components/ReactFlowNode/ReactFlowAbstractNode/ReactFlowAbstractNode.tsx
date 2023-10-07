import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import abstract_icon from '../../../public/abstract_icon.png';
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
  const theme = useTheme();

  return (
    <Card
      className="Card-react-flow"
      style={{
        borderColor: theme.palette.yellowDark,
        background: `${theme.palette.orangeLight}08`,
borderRadius: '5px',
        borderStyle:'stone',
        borderWidth:'3px',    
        height:'48px'
      }}
    >
<img src={abstract_icon.src} width="25" height="25" style={{ float: 'left', marginTop: "-2px"}} /> 
    
      {label}
      <Handle type="source" position={Position.Right} style={{background:'teal', height:'25px', width:'5px', borderRadius:'2px'}} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} style={{background:'teal', height:'25px', width:'5px', borderRadius:'2px'}} />
    </Card>
  );
};

export default ReactFlowAbstractNode;
