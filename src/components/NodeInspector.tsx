import { X, Palette, Type, FileText } from 'lucide-react';
import type { BlueprintNodeData, BlueprintNode } from '../types';
import './NodeInspector.css';

interface NodeInspectorProps {
  node: BlueprintNode | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: Partial<BlueprintNodeData>) => void;
}

const COLORS = [
  '#646cff', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
];

export default function NodeInspector({ node, onClose, onUpdateNode }: NodeInspectorProps) {
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
            className="input-field"
            value={node.data.label}
            onChange={(e) => onUpdateNode(node.id, { label: e.target.value })}
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
            className="input-field textarea-field"
            value={node.data.notes}
            onChange={(e) => onUpdateNode(node.id, { notes: e.target.value })}
            placeholder="Add detailed notes here..."
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}
