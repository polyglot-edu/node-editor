import { Handle, Position } from "react-flow-renderer";
import useStore from "../../../store";
import { SingleChoiceNode } from "../../../types/polyglotElements";
import Card from "../../Card/Card";
import { ReactFlowNodeProps } from "../ReactFlowNode";

type ReactFlowSingleChoiceNodeProps = ReactFlowNodeProps & SingleChoiceNode;

const ReactFlowSingleChoiceNode = ({ data }: ReactFlowSingleChoiceNodeProps) => {
    const onConnect = useStore(state => state.onConnect);

    return (
        <Card className="Card-react-flow" >
            {data.label}
            <Handle
                type="source"
                position={Position.Right}
                onConnect={onConnect}
            />
        </Card>
    );
}

export default ReactFlowSingleChoiceNode;