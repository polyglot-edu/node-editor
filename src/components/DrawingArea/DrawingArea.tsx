import ReactFlow, { Background, BackgroundVariant, Controls, Elements } from 'react-flow-renderer';
import { nodeTypes } from '../../types/polyglotElements';
import "./DrawingArea.css";

type DrawingAreaProps = {
    onSelectionChange: (elements: Nullable<Elements>) => void;
    elements: Elements;
};

const DrawingArea = ({ onSelectionChange, elements }: DrawingAreaProps) => {
    return (
        <div className="flex flex-col flex-1 w-[calc(100%_-_var(--properties-bar-width))] ease-in-out duration-300" onContextMenu={e => e.preventDefault()}>
            <ReactFlow
                elements={elements}
                multiSelectionKeyCode={"DISABLED"}
                onSelectionChange={onSelectionChange}
                nodeTypes={nodeTypes}
            >
                <Background variant={BackgroundVariant.Dots} />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default DrawingArea;