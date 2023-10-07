import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import close_question_icon from '../../../public/close_question_icon.png';
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
borderRadius: '5px',
        borderStyle:'stone',
        borderWidth:'3px',
        height:'48px'
      }}
    >
<img src={close_question_icon.src} width="20" height="20" style={{float: 'left',   marginRight:"5px"}} /> 
    
      {label}
      <Handle type="source" position={Position.Right} style={{background:'teal', height:'25px', width:'5px', borderRadius:'2px', borderBlock:''}} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} style={{background:'teal', height:'25px', width:'5px', borderRadius:'2px'}} />
    </Card>
  );
};

export default ReactFlowCloseEndedQuestionNode;
