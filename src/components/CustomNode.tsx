import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { FileText } from 'lucide-react';
import type { BlueprintNode } from '../types';
import './CustomNode.css';

const CustomNode = ({ data, selected, height }: NodeProps<BlueprintNode>) => {
  // We check if height is greater than 100px to consider it 'expanded'
  const isExpanded = height && height > 100;

  return (
    <div 
      className={`custom-node glass ${selected ? 'selected' : ''}`}
      style={{ '--node-color': data.color } as React.CSSProperties}
    >
      <NodeResizer 
        color={data.color} 
        isVisible={selected} 
        minWidth={180} 
        minHeight={80} 
        handleStyle={{ width: 16, height: 16 }}
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        className="handle" 
      />
      
      <div className="node-header">
        <div className="node-color-indicator" style={{ backgroundColor: data.color }} />
        <div className="node-title">{data.label || 'Untitled Node'}</div>
      </div>
      
      {data.notes && !isExpanded && (
        <div className="node-notes-indicator">
          <FileText size={14} />
          <span>Info</span>
        </div>
      )}

      {data.notes && isExpanded && (
        <div className="node-notes-content">
          {data.notes}
        </div>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="handle"
      />
    </div>
  );
};

export default memo(CustomNode);
