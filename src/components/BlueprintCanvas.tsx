import { useState } from 'react';
import { Lock, Unlock, Map as MapIcon } from 'lucide-react';
import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  MiniMap,
} from '@xyflow/react';
import type {
  NodeTypes,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
import type { BlueprintNode } from '../types';

const nodeTypes: NodeTypes = {
  custom: CustomNode as any, // React Flow types can be strict with custom nodes
};

interface BlueprintCanvasProps {
  nodes: BlueprintNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<BlueprintNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onConnectEnd: (event: MouseEvent | TouchEvent, connectionState: any) => void;
  onNodeClick?: (event: React.MouseEvent, node: BlueprintNode) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
}

export default function BlueprintCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onConnectEnd,
  onNodeClick,
  onDragOver,
  onDrop,
}: BlueprintCanvasProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [showMinimap, setShowMinimap] = useState(() => {
    const saved = localStorage.getItem('blueprint-minimap-visible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const handleToggleMinimap = () => {
    const newValue = !showMinimap;
    setShowMinimap(newValue);
    localStorage.setItem('blueprint-minimap-visible', JSON.stringify(newValue));
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{ style: { strokeWidth: 6 } }}
        fitView
        colorMode="dark"
        minZoom={0.2}
        maxZoom={4}
        nodesDraggable={!isLocked}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background gap={24} size={2} color="rgba(255, 255, 255, 0.05)" />
        <Controls showInteractive={false}>
          <ControlButton onClick={() => setIsLocked(!isLocked)} title="Toggle Interactivity">
            {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </ControlButton>
          <ControlButton onClick={handleToggleMinimap} title="Toggle Minimap">
            <MapIcon size={14} />
          </ControlButton>
        </Controls>
        {showMinimap && (
          <MiniMap 
            zoomable 
            pannable 
            nodeColor={(n: any) => n.data?.color || '#646cff'} 
          />
        )}
      </ReactFlow>
    </div>
  );
}
