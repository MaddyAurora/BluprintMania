import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import type { BlueprintNode } from '../types';
import './CustomNode.css';

const CustomNode = ({ data, selected, width, height }: NodeProps<BlueprintNode>) => {
  const isExpanded = height && height > 100;
  const hasNotes = Boolean(data.notes && data.notes.trim().length > 0);
  const hasImage = Boolean(data.image && data.imageWidth && data.imageHeight);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const [minAllowedHeight, setMinAllowedHeight] = useState(50);
  const [headerHeight, setHeaderHeight] = useState(30);

  useEffect(() => {
    if (headerRef.current) {
      const currentHeaderHeight = headerRef.current.offsetHeight;
      setHeaderHeight(currentHeaderHeight);
      
      // 12px top padding + 12px bottom padding = 24px
      let h = currentHeaderHeight + 24; 
      
      // Expand minimum boundary if it has interactive elements
      if (hasNotes || hasImage) {
        h += 34; // Approximate height of the indicator plus its margin
      }
      
      setMinAllowedHeight(Math.max(50, h));
    }
  }, [data.label, hasNotes, hasImage]);

  // Dynamically calculate rendered image height based on the current width of the node
  const nodeWidth = width || 180;
  const availableImageWidth = nodeWidth - 42; // padding 16 right, 26 left
  let renderedImageHeight = 0;
  if (hasImage && data.imageWidth && data.imageHeight) {
    renderedImageHeight = (availableImageWidth * data.imageHeight) / data.imageWidth;
  }

  const imageTotalSpace = renderedImageHeight > 0 ? renderedImageHeight + 8 : 0; // +8 for margin-top

  let maxLines = 1;
  let showImage = false;
  
  if (isExpanded && height) {
    let availableHeight = height - 24 - headerHeight - 8;
    
    // Check if the image fits in the total available space
    if (hasImage && availableHeight >= imageTotalSpace) {
      showImage = true;
      availableHeight -= imageTotalSpace; // Deduct space taken by the image
    }
    
    maxLines = Math.max(1, Math.floor(availableHeight / 18));
  }
  
  // Only show notes if there's enough space remaining after the image for at least 1 line (18px)
  const showNotes = hasNotes && isExpanded && (!showImage || (height! - 24 - headerHeight - 8 - imageTotalSpace) >= 18);

  const imageBlock = showImage && (
    <div className="node-image-container" style={{ height: renderedImageHeight }}>
      <img src={data.image} className="node-image" alt="Node attachment" />
    </div>
  );

  const notesBlock = showNotes && (
    <div 
      className="node-notes-content"
      style={{ 
        WebkitLineClamp: maxLines,
        maxHeight: `${maxLines * 18}px`
      } as React.CSSProperties}
    >
      {data.notes}
    </div>
  );

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
        
        {(hasNotes || hasImage) && !isExpanded && (
          <div className="node-notes-indicator">
            {hasImage ? <ImageIcon size={14} /> : <FileText size={14} />}
            <span>{hasNotes && hasImage ? 'Info & Image' : hasImage ? 'Image attached' : 'Info'}</span>
          </div>
        )}

        {isExpanded && data.imagePosition === 'before' && imageBlock}
        {isExpanded && notesBlock}
        {isExpanded && (data.imagePosition === 'after' || !data.imagePosition) && imageBlock}

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
