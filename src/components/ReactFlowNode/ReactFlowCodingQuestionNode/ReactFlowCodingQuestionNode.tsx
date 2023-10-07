import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import coding_icon from '../../../public/coding_icon.png';
import useStore from '../../../store';
import { CodingQuestionNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowCodingQuestionElementProps = ReactFlowNodeProps &
  CodingQuestionNode;

const ReactFlowCodingQuestionNode = ({
  id,
}: ReactFlowCodingQuestionElementProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);
  const theme = useTheme();

  return (
    <Card
      className="Card-react-flow"
      style={{
        borderColor: theme.palette.greenLight,
        background: `${theme.palette.greenLight}08`,
borderRadius: '5px',
        borderStyle:'stone',
        borderWidth:'3px',    
        height:'48px',
      }}
    >
<img src={coding_icon.src} width="25" height="25" style={{float: 'left'}} /> 
    
      {label}
      <Handle type="source" position={Position.Right} style={{background:'teal', height:'25px', width:'5px', borderRadius:'2px'}} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} style={{background:'teal', height:'25px', width:'5px', borderRadius:'2px'}} />
    </Card>
  );
};

export default ReactFlowCodingQuestionNode;
