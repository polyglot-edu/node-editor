import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import mult_choice_icon from '../../../public/mult_choice_icon.png';
import useStore from '../../../store';
import { MultipleChoiceQuestionNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowMultipleChoiceQuestionNodeProps = ReactFlowNodeProps &
  MultipleChoiceQuestionNode;

const ReactFlowMultipleChoiceQuestionNode = ({
  id,
}: ReactFlowMultipleChoiceQuestionNodeProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);
  const theme = useTheme();

  return (
    <Card className="Card-react-flow">
<img src={mult_choice_icon.src} width="20" height="20" style={{float: 'left', marginTop:"2px",  marginRight:"5px"}} /> 
    
      {label}
      <Handle type="source" position={Position.Right} style={{background:'#FF5A43', height:'25px', width:'5px', borderRadius:'0px', border:'0px'}} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} style={{background:'#FF5A43', height:'25px', width:'5px', borderRadius:'0px', border:'0px'}} />
    </Card>
  );
};

export default ReactFlowMultipleChoiceQuestionNode;
