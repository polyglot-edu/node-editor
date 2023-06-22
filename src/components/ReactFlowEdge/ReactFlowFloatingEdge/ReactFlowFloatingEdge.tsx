import { useCallback } from 'react';
import { EdgeProps, MarkerType, StraightEdge, useStore } from 'reactflow';

import { getEdgeParams } from '../../../utils/reactflow';

function ReactFlowFloatingEdge({ id, source, target, style }: EdgeProps) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  return (
    <StraightEdge
      id={id}
      sourcePosition={sourcePos}
      sourceX={sx}
      sourceY={sy}
      targetPosition={targetPos}
      targetX={tx}
      targetY={ty}
      source={source}
      target={target}
      markerEnd={MarkerType.ArrowClosed}
      style={style}
    />
  );
}

export default ReactFlowFloatingEdge;
