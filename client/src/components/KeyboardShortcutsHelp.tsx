import React from 'react';
import { FiX, FiZap, FiSave, FiUpload, FiSearch, FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut, FiMaximize2 } from 'react-icons/fi';
import styles from './KeyboardShortcutsHelp.module.css';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + Z', action: 'Undo', icon: <FiRotateCcw />, description: 'Undo last action' },
    { key: 'Ctrl + Shift + Z', action: 'Redo', icon: <FiRotateCw />, description: 'Redo last action' },
    { key: 'Ctrl + S', action: 'Save', icon: <FiSave />, description: 'Save current workflow' },
    { key: 'Ctrl + E', action: 'Export', icon: <FiUpload />, description: 'Export workflow as JSON' },
    { key: 'Ctrl + F', action: 'Search', icon: <FiSearch />, description: 'Search for nodes' },
    { key: 'Ctrl + =', action: 'Zoom In', icon: <FiZoomIn />, description: 'Zoom in on canvas' },
    { key: 'Ctrl + -', action: 'Zoom Out', icon: <FiZoomOut />, description: 'Zoom out on canvas' },
    { key: 'Ctrl + 0', action: 'Zoom Fit', icon: <FiMaximize2 />, description: 'Fit canvas to view' },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Keyboard Shortcuts</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.shortcutsGrid}>
            {shortcuts.map((shortcut, index) => (
              <div key={index} className={styles.shortcutItem}>
                <div className={styles.shortcutIcon}>
                  {shortcut.icon}
                </div>
                <div className={styles.shortcutInfo}>
                  <div className={styles.shortcutKey}>{shortcut.key}</div>
                  <div className={styles.shortcutAction}>{shortcut.action}</div>
                  <div className={styles.shortcutDescription}>{shortcut.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
