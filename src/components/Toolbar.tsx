import { Plus, Download } from 'lucide-react';
import './Toolbar.css';

interface ToolbarProps {
  onAddNode: () => void;
  onExport: () => void;
}

export default function Toolbar({ onAddNode, onExport }: ToolbarProps) {
  return (
    <div className="toolbar glass">
      <div className="toolbar-title">BluprintMania</div>
      <div className="toolbar-actions">
        <button className="btn" onClick={onAddNode} title="Add Node">
          <Plus size={16} />
          <span>Add Node</span>
        </button>
        <button className="btn btn-primary" onClick={onExport} title="Export JSON">
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
