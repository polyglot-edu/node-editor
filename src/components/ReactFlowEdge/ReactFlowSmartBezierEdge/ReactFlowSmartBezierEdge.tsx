import { bezierEdgeFactory } from "@tisoap/react-flow-smart-edge";
import useStore from "../../../store";
import { ReactFlowEdgeProps } from "../ReactFlowEdge";

type ReactFlowSmartBezierEdgeProps = ReactFlowEdgeProps & {};

// wrapper around the default bezier edge with additional clickable area
const ReactFlowSmartBezierEdge = (props: ReactFlowSmartBezierEdgeProps) => {
    const label = useStore(state => state.edgeMap.get(props.id)?.title);
    const { style } = props;

    const SmartBezierEdge = bezierEdgeFactory({
        gridRatio: 2,
        nodePadding: 15,
    })

    return (
        <>
            <SmartBezierEdge {...props} label={label} />
            <SmartBezierEdge {...props} style={{ ...style, strokeWidth: 20, opacity: 0, zIndex: 10 }} />
        </>
    )
}

export default ReactFlowSmartBezierEdge;