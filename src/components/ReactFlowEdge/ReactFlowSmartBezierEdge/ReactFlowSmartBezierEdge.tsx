import { BaseEdge, getBezierPath } from 'reactflow';
import useStore from '../../../store';
import { ReactFlowEdgeProps } from '../ReactFlowEdge';

type ReactFlowSmartBezierEdgeProps = ReactFlowEdgeProps & {};

// wrapper around the default bezier edge with additional clickable area
const ReactFlowSmartBezierEdge = (props: ReactFlowSmartBezierEdgeProps) => {
  const label = useStore((state) => state.edgeMap.get(props.id)?.title);

  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props;

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
      />
      ;
    </>
  );
};

export default ReactFlowSmartBezierEdge;
