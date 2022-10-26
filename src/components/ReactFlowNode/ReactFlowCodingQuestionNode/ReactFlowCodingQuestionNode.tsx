import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'react-flow-renderer';
import useStore from '../../../store';
import { CodingQuestionNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowCodingQuestionElementProps = ReactFlowNodeProps &
  CodingQuestionNode;

const ReactFlowCodingQuestionNode = ({
  data,
}: ReactFlowCodingQuestionElementProps) => {
  const onConnect = useStore((state) => state.onConnect);
  const theme = useTheme();

  return (
    <Card
      className="Card-react-flow"
      style={{
        borderColor: theme.palette.greenLight,
        background: `${theme.palette.greenLight}08`,
      }}
    >
      {data.label}
      <Handle type="source" position={Position.Right} onConnect={onConnect} />
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default ReactFlowCodingQuestionNode;
