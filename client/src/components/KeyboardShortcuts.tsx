import React, { useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

interface KeyboardShortcutsProps {
  onSave?: () => void;
  onExport?: () => void;
  onSearch?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomFit?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onSave,
  onExport,
  onSearch,
  onZoomIn,
  onZoomOut,
  onZoomFit
}) => {
  const { undo, redo, canUndo, canRedo } = useWorkflowStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Ctrl/Cmd + Z: Undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo()) {
          undo();
        }
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if ((event.ctrlKey || event.metaKey) && 
          ((event.key === 'z' && event.shiftKey) || event.key === 'y')) {
        event.preventDefault();
        if (canRedo()) {
          redo();
        }
      }

      // Ctrl/Cmd + S: Save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave?.();
      }

      // Ctrl/Cmd + E: Export
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        onExport?.();
      }

      // Ctrl/Cmd + F: Search
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        onSearch?.();
      }

      // Ctrl/Cmd + Plus: Zoom In
      if ((event.ctrlKey || event.metaKey) && event.key === '=') {
        event.preventDefault();
        onZoomIn?.();
      }

      // Ctrl/Cmd + Minus: Zoom Out
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault();
        onZoomOut?.();
      }

      // Ctrl/Cmd + 0: Zoom Fit
      if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault();
        onZoomFit?.();
      }

      // Delete/Backspace: Delete selected nodes
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // This will be handled by ReactFlow's built-in delete functionality
      }

      // Escape: Clear selection
      if (event.key === 'Escape') {
        // This will be handled by ReactFlow's built-in escape functionality
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, onSave, onExport, onSearch, onZoomIn, onZoomOut, onZoomFit]);

  // This component doesn't render anything, it just handles keyboard events
  return null;
};

export default KeyboardShortcuts;
