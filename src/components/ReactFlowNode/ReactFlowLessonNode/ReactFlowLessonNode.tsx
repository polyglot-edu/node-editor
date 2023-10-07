import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import book_icon from '../../../public/book_icon.png';
import useStore from '../../../store';
import { LessonNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowLessonNodeProps = ReactFlowNodeProps & LessonNode;

const ReactFlowLessonNode = ({ id }: ReactFlowLessonNodeProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);
  const theme = useTheme();

  return (
    <Card
      className="Card-react-flow"
      style={{
        borderColor:theme.palette.purple,
        background: `${theme.palette.purple}08`,
        left: "10px",
        borderRadius: '5px',
        borderStyle:'stone',
        borderWidth:'3px',  
        height:'48px'      
      }}
    >
      <img src={book_icon.src} width="20" height="20" style={{float: 'left', marginTop:"2px", marginRight:"5px"}} /> 

      {label}
      <Handle type="source" position={Position.Right} style={{background:'teal', height:'25px', width:'5px', borderRadius:'2px'}} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} style={{background:'teal', height:'25px', width:'5px', borderRadius:'2px'}} />
    </Card>
  );
};

export default ReactFlowLessonNode;
