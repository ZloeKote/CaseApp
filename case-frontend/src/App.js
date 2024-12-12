import "@xyflow/react/dist/style.css";
import { useState, useMemo, useCallback, useRef, useContext, useEffect } from "react";
import LeftMenu from "./components/LeftMenu";
import NavigationPanel from "./components/NavigationPanel";
import {
  Background,
  Controls,
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  useReactFlow,
  MiniMap,
} from "@xyflow/react";
import RectangularNode from "./components/nodes/RectangularNode";
import DiamondNode from "./components/nodes/DiamondNode";
import EndArrowEdge from "./components/edges/EndArrowEdge";
import OvalNode from "./components/nodes/OvalNode";
import ParallelogramNode from "./components/nodes/ParallelogramNode";
import { useDnD } from "./context/DnDContext";
import { getDefaultNodeLabel } from "./custom-functions";
import PersonNode from "./components/nodes/PersonNode";
import IncludeEdge from "./components/edges/IncludeEdge";
import ExtendEdge from "./components/edges/ExtendEdge";
import GeneralizationEdge from "./components/edges/GeneralizationEdge";
import RealizationEdge from "./components/edges/RealizationEdge";
import CustomSmoothStepEdge from "./components/edges/CustomSmoothStepEdge";
import UseCaseNode from "./components/nodes/UseCaseNode";
import ModelContext from "./context/models";

let nodeId = 0;
let edgeId = 0;
const getNodeId = () => `node-${nodeId++}`;
const getEdgeId = () => `edge-${edgeId++}`;

function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentEdge, setCurrentEdge] = useState("customSmoothStepEdge");

  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const { currentModel } = useContext(ModelContext);
  console.log(currentModel);
  useEffect(() => {
    if (!!currentModel) {
      const fetchedNodes = currentModel?.nodes?.map((node) => {
        return {
          id: node.id,
          type: node.type,
          position: screenToFlowPosition({ x: node.position?.x, y: node.position?.y }),
          width: node.size?.width,
          height: node.size?.height,
          data: { label: node.label },
        };
      });
      const fetchedEdges = currentModel?.edges?.map((edge) => {
        return {
          id: edge.id,
          label: edge.label,
          source: edge.sourceId,
          sourceHandle: edge.sourceHandle,
          target: edge.targetId,
          targetHandle: edge.targetHandle,
          type: edge.type,
        };
      });
      setNodes(fetchedNodes);
      setEdges(fetchedEdges);
      if (fetchedNodes.length === 1) nodeId = Number(fetchedNodes[0].id.split("node-")[1]) + 1;
      else if (fetchedNodes.length > 1) {
        nodeId =
          Number(
            fetchedNodes
              .sort((a, b) => Number(b.id.split("node-")[1]) - Number(a.id.split("node-")[1]))[0]
              .id.split("node-")[1]
          ) + 1;
      }

      if (fetchedEdges.length === 1) edgeId = Number(fetchedEdges[0].id.split("edge-")[1]) + 1;
      else if (fetchedEdges.length > 1) {
        edgeId =
          Number(
            fetchedEdges
              .sort((a, b) => Number(b.id.split("edge-")[1]) - Number(a.id.split("edge-")[1]))[0]
              .id.split("edge-")[1]
          ) + 1;
      }
    }
  }, [currentModel, screenToFlowPosition]);

  const nodeTypes = useMemo(
    () => ({
      rectangularNode: RectangularNode,
      diamondNode: DiamondNode,
      ovalNode: OvalNode,
      parallelogramNode: ParallelogramNode,

      personNode: PersonNode,
      useCaseNode: UseCaseNode,
    }),
    []
  );
  const edgeTypes = useMemo(
    () => ({
      customSmoothStepEdge: CustomSmoothStepEdge,
      endArrowEdge: EndArrowEdge,
      includeEdge: IncludeEdge,
      extendEdge: ExtendEdge,
      generalizationEdge: GeneralizationEdge,
      realizationEdge: RealizationEdge,
    }),
    []
  );

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onConnect = useCallback(
    (params) => {
      const edge = { ...params, id: getEdgeId(), type: currentEdge, label: "edge" };
      setEdges((prevEdges) => addEdge(edge, prevEdges));
    },
    [currentEdge]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getNodeId(),
        type,
        position,
        data: { label: getDefaultNodeLabel(type) },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type]
  );

  return (
    <div className="layout">
      <nav className="nav">
        <NavigationPanel />
      </nav>
      <div className="workplace">
        <LeftMenu currentEdge={currentEdge} changeEdge={setCurrentEdge} />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default App;
