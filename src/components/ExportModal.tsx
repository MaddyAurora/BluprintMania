import { useState, useEffect, useRef } from 'react';
import './ExportModal.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filename: string) => void;
}

export default function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [filename, setFilename] = useState(`blueprint_${Date.now()}`);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFilename(`blueprint_${Date.now()}`);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        if (filename.trim()) {
          onExport(filename.trim());
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filename, onClose, onExport]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem', fontWeight: 600 }}>Export Blueprint</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            ref={inputRef}
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename..."
            className="input-field"
            style={{ flex: 1 }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>.json</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => filename.trim() && onExport(filename.trim())}>Export</button>
        </div>
      </div>
    </div>
  );
}
