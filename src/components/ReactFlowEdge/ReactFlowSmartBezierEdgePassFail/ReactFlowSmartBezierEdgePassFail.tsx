import { BaseEdge, EdgeMarker, getBezierPath, MarkerType } from 'reactflow';
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
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    id,
  } = props;

  const { edgeMap } = useStore();

  const edge = edgeMap.get(id);

  const condition = edge?.data?.conditionKind;
  console.log(condition);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        {...props}
        label={label}
        labelX={labelX}
        labelY={labelY}
        style={{ stroke: condition == 'fail' ? 'red' : 'green' }}
      />
      ;
    </>
  );
};

export default ReactFlowSmartBezierEdgePassFail;
