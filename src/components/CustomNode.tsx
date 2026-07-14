import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { FileText } from 'lucide-react';
import type { BlueprintNode } from '../types';
import './CustomNode.css';

const CustomNode = ({ data, selected, height }: NodeProps<BlueprintNode>) => {
  // We check if height is greater than 100px to consider it 'expanded'
  const isExpanded = height && height > 100;
  const hasNotes = Boolean(data.notes && data.notes.trim().length > 0);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const [minAllowedHeight, setMinAllowedHeight] = useState(50);
  const [headerHeight, setHeaderHeight] = useState(30);

  useEffect(() => {
    if (headerRef.current) {
      const currentHeaderHeight = headerRef.current.offsetHeight;
      setHeaderHeight(currentHeaderHeight);
      
      // 12px top padding + 12px bottom padding = 24px
      let h = currentHeaderHeight + 24; 
      
      if (hasNotes) {
        // Approximate height of the indicator plus its margin
        h += 34; 
      }
      
      setMinAllowedHeight(Math.max(50, h));
    }
  }, [data.label, hasNotes]);

  // Calculate dynamic line clamp for ellipsis
  let maxLines = 1;
  if (isExpanded && height) {
    // Available height = total height - padding(24) - headerHeight - margin(8)
    const availableHeight = height - 24 - headerHeight - 8;
    // 1.4 line-height at 0.8rem (12.8px) is ~18px per line
    maxLines = Math.max(1, Math.floor(availableHeight / 18));
  }

  return (
    <>
      <NodeResizer 
        color={data.color} 
        isVisible={selected} 
        minWidth={180} 
        minHeight={minAllowedHeight} 
        handleStyle={{ width: 16, height: 16 }}
      />
      <div 
        className={`custom-node glass ${selected ? 'selected' : ''}`}
        style={{ '--node-color': data.color } as React.CSSProperties}
      >
        <Handle 
          type="target" 
          position={Position.Top} 
          className="handle" 
        />
        
        <div className="node-header" ref={headerRef}>
          <div className="node-color-indicator" style={{ backgroundColor: data.color }} />
          <div className="node-title">{data.label || 'Untitled Node'}</div>
        </div>
        
        {hasNotes && !isExpanded && (
          <div className="node-notes-indicator">
            <FileText size={14} />
            <span>Info</span>
          </div>
        )}

        {hasNotes && isExpanded && (
          <div 
            className="node-notes-content"
            style={{ 
              WebkitLineClamp: maxLines,
              maxHeight: `${maxLines * 18}px`
            } as React.CSSProperties}
          >
            {data.notes}
          </div>
        )}

        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="handle"
        />
      </div>
    </>
  );
};

export default memo(CustomNode);
