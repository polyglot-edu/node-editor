import { bezierEdgeFactory } from "@tisoap/react-flow-smart-edge";
import { ReactFlowEdgeProps } from "../ReactFlowEdge";

type ReactFlowSmartBezierEdgeProps = ReactFlowEdgeProps & {};

// wrapper around the default bezier edge with additional clickable area
const ReactFlowSmartBezierEdge = (props: ReactFlowSmartBezierEdgeProps) => {
    const { style } = props;

    const SmartBezierEdge = bezierEdgeFactory({
        gridRatio: 15,
        nodePadding: 15,
    })

    return (
        <>
            <SmartBezierEdge {...props} />
            <SmartBezierEdge {...props} style={{ ...style, strokeWidth: 10, opacity: 0 }} />
        </>
    )
}

export default ReactFlowSmartBezierEdge;