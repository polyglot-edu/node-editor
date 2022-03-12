import { useEffect, useState } from 'react';
import { Elements } from 'react-flow-renderer/dist/types';
import loadFlowElements from '../../data/flowElements';
import { polyglotNodeComponentMapping, PolyglotEdge, PolyglotNode } from '../../types/polyglotElements';
import DrawingArea from '../DrawingArea/DrawingArea';
import PropertiesBar from '../PropertiesBar/PropertiesBar';
import './App.css';

let iNodes: PolyglotNode[] = [];
let iEdges: PolyglotEdge[] = [];
let nodeMap: Record<string, PolyglotNode> = {};
const sas = async () => {
  let { nodes: initialNodes, edges: initialEdges } = await loadFlowElements()
  iNodes = initialNodes;
  iEdges = initialEdges;
  nodeMap = Object.fromEntries(initialNodes.map(node => [node.id, node]));
  return initialNodes;
};

const App = () => {
  const [nodes, setNodes] = useState<PolyglotNode[]>([]);
  const selectedElement = useElementSelection();
  const elements = nodes;
  let first = true;

  useEffect(() => {
    if (first) {
      first = false;
      (async () => { setNodes(await sas()) })();
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        <DrawingArea onSelectionChange={selectedElement.onChange} elements={elements} />
        <PropertiesBar >
          <selectedElement.PropertiesComponent {...selectedElement.polyglotNode!} />
        </PropertiesBar>
      </header>
    </div>
  );
}

const useElementSelection = () => {
  const [selectedElement, setSelectedElement] = useState<Nullable<PolyglotNode>>(null);

  function handleChange(elements: Nullable<Elements>) {
    const firstSelectedElement = elements?.[0] ?? null;
    if (firstSelectedElement) {
      const node = nodeMap[firstSelectedElement.id];
      setSelectedElement(node);
    } else {
      setSelectedElement(null);
    }
    console.log("Selected element: ", elements?.[0]);
  }

  return {
    polyglotNode: selectedElement,
    PropertiesComponent: polyglotNodeComponentMapping.getPropertiesComponent(selectedElement?.type),
    onChange: handleChange
  };
}


export default App;
