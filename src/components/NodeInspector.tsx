import { X, Palette, Type, FileText, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import type { BlueprintNodeData, BlueprintNode } from '../types';
import './NodeInspector.css';

interface NodeInspectorProps {
  node: BlueprintNode | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: Partial<BlueprintNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
}

const COLORS = [
  '#646cff', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
  '#2563eb', '#059686', '#84cc16', '#f1ee36ff',
  '#a03cab', '#e11d48', '#203CA8', '#6e798fff'
];

export default function NodeInspector({ node, onClose, onUpdateNode, onDeleteNode }: NodeInspectorProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragActive, setIsDragActive] = useState(false);

  // Auto-focus the name input whenever a new node is selected/created
  useEffect(() => {
    if (node && node.data.isNew) {
      // Small timeout ensures the sidebar animation/render completes before focusing
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
        // Optionally select all text so typing immediately overwrites "New Node"
        nameInputRef.current?.select();

        // Clear the isNew flag so it doesn't auto-focus again on subsequent selections
        onUpdateNode(node.id, { isNew: false });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [node?.id, node?.data.isNew, onUpdateNode]);

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      notesInputRef.current?.focus();
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (!node) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;

        let finalDataUrl = dataUrl;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            finalDataUrl = canvas.toDataURL(file.type, 0.8);
          }
        }

        onUpdateNode(node.id, {
          image: finalDataUrl,
          imageWidth: width,
          imageHeight: height,
          imagePosition: node.data.imagePosition || 'before'
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  if (!node) return null;

  return (
    <div className="node-inspector glass">
      <div className="inspector-header">
        <h3>Edit Node</h3>
        <button className="btn btn-icon" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="inspector-body">
        <div className="form-group">
          <label>
            <Type size={14} />
            Name
          </label>
          <input
            ref={nameInputRef}
            className="input-field"
            value={node.data.label}
            onChange={(e) => onUpdateNode(node.id, { label: e.target.value })}
            onKeyDown={handleNameKeyDown}
            placeholder="Node Name"
          />
        </div>

        <div className="form-group">
          <label>
            <Palette size={14} />
            Color
          </label>
          <div className="color-picker">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`color-btn ${node.data.color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => onUpdateNode(node.id, { color: c })}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>
            <FileText size={14} />
            Notes
          </label>
          <textarea
            ref={notesInputRef}
            className="input-field textarea-field"
            value={node.data.notes}
            onChange={(e) => onUpdateNode(node.id, { notes: e.target.value })}
            placeholder="Add detailed notes here..."
            rows={5}
          />
        </div>

        <div className="form-group">
          <label>
            <ImageIcon size={14} />
            Image
          </label>

          {node.data.image ? (
            <div className="image-preview-container">
              <img src={node.data.image} alt="Node attachment" className="image-thumbnail" />
              <button
                className="remove-image-btn"
                onClick={() => onUpdateNode(node.id, { image: undefined, imageWidth: undefined, imageHeight: undefined })}
                title="Remove Image"
              >
                <X size={14} />
              </button>

              <div className="position-toggles">
                <button
                  className={`btn ${node.data.imagePosition === 'before' || !node.data.imagePosition ? 'active' : ''}`}
                  onClick={() => onUpdateNode(node.id, { imagePosition: 'before' })}
                >
                  Before Note
                </button>
                <button
                  className={`btn ${node.data.imagePosition === 'after' ? 'active' : ''}`}
                  onClick={() => onUpdateNode(node.id, { imagePosition: 'after' })}
                >
                  After Note
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`image-upload-zone ${isDragActive ? 'drag-active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleImageFile(file);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              />
              <Upload size={24} className="image-upload-icon" />
              <span>Drag & drop an image or click to browse</span>
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <button
            className="btn"
            style={{ width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            onClick={() => onDeleteNode(node.id)}
          >
            <Trash2 size={16} style={{ marginRight: '8px' }} />
            Delete Node
          </button>
        </div>
      </div>
    </div>
  );
}
