import { getSmartEdge } from '@tisoap/react-flow-smart-edge';
import {
  BezierEdge,
  EdgeLabelRenderer,
  EdgeMarker,
  MarkerType,
  useNodes,
} from 'reactflow';
import useStore from '../../../store';
import { ReactFlowEdgeProps } from '../ReactFlowEdge';

type ReactFlowSmartBezierEdgeProps = ReactFlowEdgeProps & {};

// wrapper around the default bezier edge with additional clickable area
const ReactFlowSmartBezierEdgePassFail = (
  props: ReactFlowSmartBezierEdgeProps
) => {
  const label = useStore((state) => state.edgeMap.get(props.id)?.title);

  const passFailMarker: EdgeMarker = {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#FF0072',
  };

  const {
    id,
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
  } = props;

  const { edgeMap } = useStore();

  const edge = edgeMap.get(id);

  const condition = edge?.data?.conditionKind;

  const nodes = useNodes();

  const getSmartEdgeResponse = getSmartEdge({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    nodes,
  });

  // If the value returned is null, it means "getSmartEdge" was unable to find
  // a valid path, and you should do something else instead
  if (getSmartEdgeResponse === null) {
    return <BezierEdge {...props} />;
  }

  const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse;

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={svgPathString}
        markerEnd={markerEnd}
        style={{ stroke: condition == 'fail' ? 'red' : 'green' }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            background: 'transparent',
            padding: 10,
            fontSize: 12,
            transform: `translate(${edgeCenterX - 20}px,${edgeCenterY - 20}px)`,
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
      ;
    </>
  );
};
export default ReactFlowSmartBezierEdgePassFail;
