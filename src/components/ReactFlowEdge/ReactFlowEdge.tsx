import { EdgeProps } from "react-flow-renderer"

export type ReactFlowEdgeProps = EdgeProps & {};

declare const ReactFlowEdge: (props: ReactFlowEdgeProps) => JSX.Element;

export default ReactFlowEdge;