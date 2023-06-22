import { CircularProgress, Flex, Text } from '@chakra-ui/react';
import ELK from 'elkjs';
import { useEffect, useMemo, useState } from 'react';
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import { v4 } from 'uuid';
import ReactFlowConceptNode from '../../ReactFlowNode/ReactFlowConceptNode/ReactFlowConceptNode';

import { useFormContext } from 'react-hook-form';
import { APIV2 } from '../../../data/api';
import ReactFlowFloatingEdge from '../../ReactFlowEdge/ReactFlowFloatingEdge/ReactFlowFloatingEdge';

type ConceptGraphProps = {
  concept: string;
  graphDepth: number;
};

const ConceptGraph = ({ concept, graphDepth }: ConceptGraphProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const nodeTypes = useMemo(() => ({ conceptNode: ReactFlowConceptNode }), []);
  const edgeTypes = useMemo(() => ({ floating: ReactFlowFloatingEdge }), []);
  const [loading, setLoading] = useState(true);
  const { setValue } = useFormContext();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const api = new APIV2(undefined);

      const resp = await api.getConceptGraph(concept, graphDepth);

      const conceptMap = resp.data;

      setValue('data.conceptmap', conceptMap);

      const elk = new ELK();

      const graph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'radial',
        },
        children: conceptMap.nodes.map((n) => ({
          id: n._id,
          width: 200,
          height: 200,
          labels: [{ text: n.name }],
        })),
        edges: conceptMap.edges.map((e) => ({
          id: v4(),
          sources: [e.from],
          targets: [e.to],
        })),
      };

      const elkGraph = await elk.layout(graph);
      if (elkGraph.edges) {
        setEdges(
          elkGraph.edges.map((edge) => {
            return {
              id: edge.id,
              type: 'floating',
              source: edge.sources[0],
              target: edge.targets[0],
            };
          })
        );
      }
      if (elkGraph.children) {
        setNodes([
          ...elkGraph.children.map((node) => {
            return {
              ...node,
              type: 'conceptNode',
              position: {
                x: node.x ?? 0,
                y: node.y ?? 0,
              },
              data: {
                label: node.labels?.[0].text ?? '',
              },
            };
          }),
        ]);
      }
      setLoading(false);
    })();
  }, [concept, graphDepth, setValue]);

  return (
    <ReactFlowProvider>
      <Flex
        h={'70vh'}
        overflow="hidden"
        justifyContent={'center'}
        placeItems="center"
      >
        {loading ? (
          <Flex direction={'column'} placeItems="center">
            <CircularProgress isIndeterminate color="blue.300" mb={2} />
            <Text fontWeight={'bold'} fontSize="lg">
              Generating graph...
            </Text>
          </Flex>
        ) : (
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            edges={edges}
            fitView={true}
            fitViewOptions={{ padding: 0.2 }}
            snapToGrid={true}
            onNodesChange={(changes) => {
              setNodes(applyNodeChanges(changes, nodes));
            }}
            onEdgesChange={(changes) =>
              setEdges(applyEdgeChanges(changes, edges))
            }
          >
            <Background variant={BackgroundVariant.Dots} />
            <Controls />
          </ReactFlow>
        )}
      </Flex>
    </ReactFlowProvider>
  );
};

export default ConceptGraph;
