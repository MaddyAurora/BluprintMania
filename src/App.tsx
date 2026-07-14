import { useState, useCallback } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import type { Connection, Edge } from '@xyflow/react';
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { getViewport } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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

  const onNodeClick = useCallback((_: React.MouseEvent, node: BlueprintNode) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

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

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <>
      <Toolbar onAddNode={onAddNode} onExport={onExport} />
      
      <BlueprintCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
      />

      <NodeInspector
        node={selectedNode}
        onClose={() => setSelectedNodeId(null)}
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
