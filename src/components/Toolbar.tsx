import { useRef } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import './Toolbar.css';

interface ToolbarProps {
  onAddNode: () => void;
  onExport: () => void;
  onImport: (data: any) => void;
}

export default function Toolbar({ onAddNode, onExport, onImport }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          onImport(json);
        } catch (err) {
          alert('Failed to parse JSON file. Please ensure it is a valid BluprintMania export.');
        }
      };
      reader.readAsText(file);
    }
    // reset the input so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="toolbar glass">
      <div className="toolbar-title">BluprintMania</div>
      <div className="toolbar-actions">
        <button className="btn" onClick={onAddNode} title="Add Node">
          <Plus size={16} />
          <span>Add Node</span>
        </button>
        
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        <button className="btn" onClick={() => fileInputRef.current?.click()} title="Import JSON">
          <Upload size={16} />
          <span>Import</span>
        </button>

        <button className="btn btn-primary" onClick={onExport} title="Export JSON">
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
