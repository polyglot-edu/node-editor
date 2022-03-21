import { useMemo, useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import { v4 as UUIDv4 } from "uuid";
import { HandleData, MultipleChoiceNode } from "../../../types/polyglotElements";
import Card from "../../Card/Card";
import { ReactFlowNodeProps } from "../ReactFlowNode";
import "./ReactFlowMultipleChoiceNode.css";

type ReactFlowMultipleChoiceNodeProps = ReactFlowNodeProps & MultipleChoiceNode;

const ReactFlowMultipleChoiceNode = ({ data }: ReactFlowMultipleChoiceNodeProps) => {
    const [handles, setHandles] = useState<HandleData[]>([]);

    const handleChange = () => {
        const newHandle: HandleData = {
            handleProps: {
                type: "source",
                position: Position.Right,
                isConnectable: true,
                onConnect: params => console.log(params),
                isValidConnection: e => true,
                id: UUIDv4().toString(),
            }
        }
        setHandles([...handles, newHandle]);
    }

    const handleElements = useMemo(
        () =>
            handles.map((h: HandleData, i: number) => {
                const { type, position, isConnectable, onConnect, isValidConnection, id } = h.handleProps;
                const stepSize = 100 / (handles.length + 1);
                const distanceFromTop = stepSize * i + stepSize;

                return (
                    <Handle
                        className="bg-slate-500"
                        id={id}
                        type={type}
                        position={position}
                        isConnectable={isConnectable}
                        onConnect={onConnect}
                        isValidConnection={isValidConnection}
                        style={{ top: `${distanceFromTop}%` }}
                    />
                );
            }),
        [handles]
    );


    return (
        <Card style={{ border: "1px solid black" }}>
            <Handle
                className="bg-slate-500"
                type="target"
                position={Position.Left}
                onConnect={(params) => console.log("onConnect", params)}
            />
            {handleElements}
            <div>
                {data.label}
            </div>
            <button className="border border-slate-400 border-solid" onClick={handleChange}>+</button>
        </Card>
    );
}

export default ReactFlowMultipleChoiceNode;