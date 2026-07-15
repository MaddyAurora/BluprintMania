import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import type { BlueprintNode } from '../types';
import './CustomNode.css';

const CustomNode = ({ id, data, selected, width, height }: NodeProps<BlueprintNode>) => {
  const { setNodes } = useReactFlow();
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
      let extraHeight = 0;
      if (hasImage && hasNotes) {
        extraHeight = 34 + 26; // Space for image indicator + 1 line of notes
      } else if (hasImage) {
        extraHeight = 34; // Space for image indicator
      } else if (hasNotes) {
        extraHeight = 26; // Space for 1 line of notes
      }
      
      setMinAllowedHeight(Math.max(50, h + extraHeight));
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

  let maxLines = 2; // Default to 2 lines if not explicitly sized
  let showImage = false;
  let showNotes = hasNotes;
  
  if (height) {
    let availableHeight = height - 24 - headerHeight - 8;
    
    // Check if the image fits in the total available space
    if (hasImage && availableHeight >= imageTotalSpace) {
      showImage = true;
      availableHeight -= imageTotalSpace; // Deduct space taken by the image
    }
    
    // Deduct space for the image indicator if the image is present but not shown
    if (hasImage && !showImage) {
      availableHeight -= 34;
    }
    
    // Only show notes if there's enough space remaining for at least 1 line (18px)
    if (availableHeight >= 18) {
      maxLines = Math.max(1, Math.floor(availableHeight / 18));
    } else {
      showNotes = false;
    }
  }

  const showImageIndicator = hasImage && !showImage;

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
        onPointerDown={(e) => {
          if (!selected) {
            setNodes((nds) => nds.map((n) => ({
              ...n,
              selected: n.id === id || (e.shiftKey && n.selected),
            })));
          }
        }}
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
        
        {showImageIndicator && (
          <div className="node-notes-indicator">
            <ImageIcon size={14} />
            <span>Image attached</span>
          </div>
        )}

        {showImage && data.imagePosition === 'before' && imageBlock}
        {notesBlock}
        {showImage && (data.imagePosition === 'after' || !data.imagePosition) && imageBlock}

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
