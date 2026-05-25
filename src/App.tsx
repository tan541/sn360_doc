import { useState, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

// Endpoint Agent States
const states = [
  {
    id: '1',
    label: 'Never Connected',
    description: 'Record on manager but local agent not connected.',
  },
  {
    id: '2',
    label: 'Pending',
    description: 'The local daemon is running and waiting for the first acknowledgment signal from the manager.',
  },
  {
    id: '3',
    label: 'Active',
    description: 'An acknowledgment signal has successfully been received from the manager within the last 10 seconds.',
  },
  {
    id: '4',
    label: 'Disconnected',
    description: 'No contact for >60s.',
  },
];

// Define node positions linearly
const positions = {
  '1': { x: 250, y: 50 },
  '2': { x: 250, y: 200 },
  '3': { x: 250, y: 350 },
  '4': { x: 250, y: 500 },
};

// Define edges between consecutive states and restore
const edgeConnections = [
  { source: '1', target: '2', appearsAt: 2, sourceHandle: 'bottom', targetHandle: 'top' },
  { source: '2', target: '3', appearsAt: 3, sourceHandle: 'bottom', targetHandle: 'top' },
  { source: '3', target: '4', appearsAt: 4, sourceHandle: 'bottom', targetHandle: 'top' },
  { source: '4', target: '3', appearsAt: 5, label: 'Restore', sourceHandle: 'right-source', targetHandle: 'right-target', type: 'step' },
];

const MAX_STEPS = 5;

const CustomNodeComponent = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right-source" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Right} id="right-target" style={{ top: '60%' }} />
      {data.label}
    </>
  );
};

const nodeTypes = {
  custom: CustomNodeComponent,
};

function createNode(state: typeof states[0], visible: boolean): Node {
  return {
    id: state.id,
    type: 'custom',
    position: positions[state.id as keyof typeof positions],
    data: { 
      label: (
        <div className="custom-node">
          <div className="node-title">{state.label}</div>
          <div className="node-desc">{state.description}</div>
        </div>
      ) 
    },
    style: {
      width: 250,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: visible ? 'auto' : 'none',
      background: '#fff',
      border: '2px solid #222',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  };
}

function createEdge(conn: typeof edgeConnections[0], visible: boolean): Edge {
  return {
    id: `e${conn.source}-${conn.target}-${conn.appearsAt}`,
    source: conn.source,
    target: conn.target,
    sourceHandle: conn.sourceHandle,
    targetHandle: conn.targetHandle,
    type: conn.type || 'default',
    label: visible && 'label' in conn ? conn.label : undefined,
    animated: true,
    style: {
      stroke: '#222',
      strokeWidth: 2,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#222',
    },
  };
}

function App() {
  const [visibleCount, setVisibleCount] = useState(1);

  const getNodes = (count: number) => {
    return states.map((state, index) => createNode(state, index < count));
  };

  const initialNodes = getNodes(1);
  const initialEdges = edgeConnections.map((conn, index) => createEdge(conn, index < 0));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getEdgeVisibility = (conn: typeof edgeConnections[0], count: number) => {
    return count >= conn.appearsAt;
  };

  const handleNext = useCallback(() => {
    if (visibleCount < MAX_STEPS) {
      const newCount = visibleCount + 1;
      setVisibleCount(newCount);
      setNodes(getNodes(newCount));
      setEdges(edgeConnections.map(conn => createEdge(conn, getEdgeVisibility(conn, newCount))));
    }
  }, [visibleCount, setNodes, setEdges]);

  const handlePrev = useCallback(() => {
    if (visibleCount > 1) {
      const newCount = visibleCount - 1;
      setVisibleCount(newCount);
      setNodes(getNodes(newCount));
      setEdges(edgeConnections.map(conn => createEdge(conn, getEdgeVisibility(conn, newCount))));
    }
  }, [visibleCount, setNodes, setEdges]);

  const handleReset = useCallback(() => {
    setVisibleCount(1);
    setNodes(getNodes(1));
    setEdges(edgeConnections.map((conn) => createEdge(conn, false)));
  }, [setNodes, setEdges]);

  return (
    <div className="app-container">
      <div className="header">
        <h1>EDR Workflow</h1>
        <p>Endpoint Agent State Flow</p>
      </div>
      
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#ddd" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <div className="controls">
        <button onClick={handlePrev} disabled={visibleCount <= 1} className="nav-btn">
          Previous
        </button>
        <span className="step-counter">
          Step {visibleCount} of {MAX_STEPS}
        </span>
        <button onClick={handleNext} disabled={visibleCount >= MAX_STEPS} className="nav-btn">
          Next
        </button>
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
