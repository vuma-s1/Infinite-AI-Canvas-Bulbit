import React, { useState } from 'react';
import { FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut, FiMaximize2, FiSave, FiFolder, FiDownload } from 'react-icons/fi';
import { useWorkflowStore } from '../store/workflowStore';
import SaveDialog from './SaveDialog';
import styles from './CanvasToolbar.module.css';

interface CanvasToolbarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomFit?: () => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomFit
}) => {
  const { undo, redo, canUndo, canRedo, startAutoSave, stopAutoSave, lastAutoSave } = useWorkflowStore();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveDialogMode, setSaveDialogMode] = useState<'save' | 'load' | 'export'>('save');
  const [showSaveStatus, setShowSaveStatus] = useState(false);

  // Show save status when auto-save happens
  React.useEffect(() => {
    if (lastAutoSave > 0) {
      setShowSaveStatus(true);
      const timer = setTimeout(() => setShowSaveStatus(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAutoSave]);

  const handleSaveClick = () => {
    setSaveDialogMode('save');
    setSaveDialogOpen(true);
  };

  const handleLoadClick = () => {
    setSaveDialogMode('load');
    setSaveDialogOpen(true);
  };

  const handleExportClick = () => {
    setSaveDialogMode('export');
    setSaveDialogOpen(true);
  };

  const handleCloseSaveDialog = () => {
    setSaveDialogOpen(false);
  };

  // Add keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            handleSaveClick();
            break;
          case 'o':
            event.preventDefault();
            handleLoadClick();
            break;
          case 'e':
            event.preventDefault();
            handleExportClick();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button
            className={`${styles.toolbarButton} ${!canUndo() ? styles.disabled : ''}`}
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
          >
            <FiRotateCcw />
          </button>
          <button
            className={`${styles.toolbarButton} ${!canRedo() ? styles.disabled : ''}`}
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Ctrl+Y)"
          >
            <FiRotateCw />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            className={styles.toolbarButton}
            onClick={onZoomOut}
            title="Zoom Out (Ctrl+-)"
          >
            <FiZoomOut />
          </button>
          <button
            className={styles.toolbarButton}
            onClick={onZoomIn}
            title="Zoom In (Ctrl+=)"
          >
            <FiZoomIn />
          </button>
          <button
            className={styles.toolbarButton}
            onClick={onZoomFit}
            title="Zoom to Fit (Ctrl+0)"
          >
            <FiMaximize2 />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            className={styles.toolbarButton}
            onClick={handleSaveClick}
            title="Save Project (Ctrl+S)"
          >
            <FiSave />
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleLoadClick}
            title="Load Project"
          >
            <FiFolder />
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleExportClick}
            title="Export Project"
          >
            <FiDownload />
          </button>
        </div>
      </div>

      <SaveDialog
        isOpen={saveDialogOpen}
        onClose={handleCloseSaveDialog}
        mode={saveDialogMode}
      />

      {/* Save Status Indicator */}
      {showSaveStatus && (
        <div className={styles.saveStatus}>
          <span className={styles.saveStatusText}>Auto-saved</span>
        </div>
      )}
    </>
  );
};

export default CanvasToolbar;
