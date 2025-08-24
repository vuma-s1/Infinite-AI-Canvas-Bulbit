import React from 'react';
import { FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut, FiMaximize2 } from 'react-icons/fi';
import { useWorkflowStore } from '../store/workflowStore';
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
  const { undo, redo, canUndo, canRedo } = useWorkflowStore();

  return (
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
    </div>
  );
};

export default CanvasToolbar;
