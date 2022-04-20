import { Handle, Position } from "react-flow-renderer";
import useStore from "../../../store";
import { CloseEndedQuestionNode } from "../../../types/polyglotElements";
import Card from "../../Card/Card";
import { ReactFlowNodeProps } from "../ReactFlowNode";

type ReactFlowCloseEndedQuestionNodeProps = ReactFlowNodeProps & CloseEndedQuestionNode;

const ReactFlowCloseEndedQuestionNode = ({ data }: ReactFlowCloseEndedQuestionNodeProps) => {
    const onConnect = useStore(state => state.onConnect);

    return (
        <Card className="Card-react-flow" >
            {data.label}
            <Handle
                type="source"
                position={Position.Right}
                onConnect={onConnect}
            />
            <Handle
                type="target"
                position={Position.Left}
            />
        </Card>
    );
}

export default ReactFlowCloseEndedQuestionNode;