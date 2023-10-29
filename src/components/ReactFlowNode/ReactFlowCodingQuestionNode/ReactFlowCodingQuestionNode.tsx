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
    <Card className="Card-react-flow">
<img src={coding_icon.src} width="25" height="25" style={{float: 'left'}} /> 
    
      {label}
      <Handle type="source" position={Position.Right} style={{background:'#3B1D5C', height:'25px', width:'5px', borderRadius:'0px', border:'0px'}} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} style={{background:'#3B1D5C', height:'25px', width:'5px', borderRadius:'0px', border:'0px'}} />
    </Card>
  );
};

export default ReactFlowCodingQuestionNode;
