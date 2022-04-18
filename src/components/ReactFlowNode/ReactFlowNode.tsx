import { NodeProps } from "react-flow-renderer"

export type ReactFlowNodeProps = NodeProps & {};

declare const ReactFlowNode: (props: ReactFlowNodeProps) => JSX.Element;

export default ReactFlowNode;