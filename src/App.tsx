import { useCallback } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import type { Connection, Edge, ConnectionState } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

import BlueprintCanvas from './components/BlueprintCanvas';
import Toolbar from './components/Toolbar';
import NodeInspector from './components/NodeInspector';
import { exportBlueprintToJSON } from './utils/exportBlueprint';
import type { BlueprintNodeData, BlueprintNode } from './types';

const initialNodes: BlueprintNode[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 150 },
    data: { label: 'Start Node', color: '#646cff', notes: 'This is the beginning of our blueprint.' },
  },
];

const initialEdges: Edge[] = [];

function BlueprintEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<BlueprintNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getViewport, screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: ConnectionState) => {
      // If the connection was valid, it connected to an existing node, so we do nothing.
      if (connectionState.isValid) return;

      // Extract coordinates from mouse or touch event
      const clientX = 'changedTouches' in event ? event.changedTouches[0].clientX : (event as MouseEvent).clientX;
      const clientY = 'changedTouches' in event ? event.changedTouches[0].clientY : (event as MouseEvent).clientY;

      // Convert screen coordinates to canvas coordinates
      const position = screenToFlowPosition({ x: clientX, y: clientY });

      // Calculate an offset so the node appears exactly where dropped, not anchored by top-left
      // A standard node is 180x80 roughly, so subtract half
      const adjustedPosition = {
        x: position.x - 90,
        y: position.y - 40,
      };

      const newNodeId = uuidv4();
      const newNode: BlueprintNode = {
        id: newNodeId,
        type: 'custom',
        position: adjustedPosition,
        data: {
          label: 'New Node',
          color: '#06b6d4',
          notes: '',
        },
      };

      setNodes((nds) => nds.concat(newNode));

      if (connectionState.fromNode?.id) {
        setEdges((eds) =>
          eds.concat({
            id: uuidv4(),
            source: connectionState.fromNode!.id,
            sourceHandle: connectionState.fromHandle?.id || null,
            target: newNodeId,
            targetHandle: null,
          })
        );
      }
    },
    [screenToFlowPosition, setNodes, setEdges]
  );

  const onAddNode = useCallback(() => {
    const newNode: BlueprintNode = {
      id: uuidv4(),
      type: 'custom',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: 'New Node',
        color: '#10b981',
        notes: '',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onExport = useCallback(() => {
    const viewport = getViewport();
    exportBlueprintToJSON(nodes, edges, viewport);
  }, [nodes, edges, getViewport]);

  const onUpdateNode = useCallback((nodeId: string, data: Partial<BlueprintNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const closeInspector = useCallback(() => {
    setNodes((nds) => nds.map((n) => (n.selected ? { ...n, selected: false } : n)));
  }, [setNodes]);

  const selectedNode = nodes.find((n) => n.selected) || null;

  return (
    <>
      <Toolbar onAddNode={onAddNode} onExport={onExport} />
      
      <BlueprintCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
      />

      <NodeInspector
        node={selectedNode}
        onClose={closeInspector}
        onUpdateNode={onUpdateNode}
      />
    </>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <BlueprintEditor />
    </ReactFlowProvider>
  );
}
