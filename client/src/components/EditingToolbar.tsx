import React, { useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './EditingToolbar.module.css';
import ExecutionButton from './ExecutionButton';
import { 
  FiSave, 
  FiZoomIn, 
  FiZoomOut, 
  FiRotateCcw, 
  FiRotateCw, 
  FiTrash2, 
  FiCopy, 
  FiClipboard, 
  FiScissors,
  FiLayers,
  FiMove,
  FiLink,
  FiGrid,
  FiMaximize2,
  FiMinimize2,
  FiSearch,
  FiPlus,
  FiDownload,
  FiShare2,
  FiSettings,
  FiEye,
  FiEyeOff,
  FiHome,
  FiZap,
  FiFileText
} from 'react-icons/fi';

interface EditingToolbarProps {
  onSave: () => void;
  onExport: () => void;
  onSearch: () => void;
  onShare: () => void;
  onHome?: () => void;
  onShortcuts?: () => void;
}

const EditingToolbar: React.FC<EditingToolbarProps> = ({ 
  onSave, 
  onExport, 
  onSearch, 
  onShare,
  onHome,
  onShortcuts
}) => {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Undo/Redo functionality
  const [history, setHistory] = useState<Array<{nodes: any[], edges: any[]}>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize history with current state
  React.useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const initialState = { nodes: [...nodes], edges: [...edges] };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, []);

  const addToHistory = (newNodes: any[], newEdges: any[]) => {
    const newState = { nodes: [...newNodes], edges: [...newEdges] };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setNodes([...state.nodes]);
      setEdges([...state.edges]);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setNodes([...state.nodes]);
      setEdges([...state.edges]);
      setHistoryIndex(newIndex);
    }
  };

  // Track changes to nodes and edges for undo/redo
  React.useEffect(() => {
    if (history.length > 0 && historyIndex >= 0) {
      const currentState = history[historyIndex];
      const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(currentState.nodes);
      const edgesChanged = JSON.stringify(edges) !== JSON.stringify(currentState.edges);
      
      if (nodesChanged || edgesChanged) {
        // Add new state to history
        addToHistory(nodes, edges);
      }
    }
  }, [nodes, edges]);

  // Keyboard shortcuts for undo/redo
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if ((event.key === 'y') || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history.length]);

  // Clipboard operations
  const copySelected = () => {
    // Implementation for copying selected nodes
    console.log('Copy selected nodes');
  };

  const paste = () => {
    // Implementation for pasting nodes
    console.log('Paste nodes');
  };

  const cut = () => {
    // Implementation for cutting selected nodes
    console.log('Cut selected nodes');
  };

  // Delete selected nodes
  const deleteSelected = () => {
    // Implementation for deleting selected nodes
    console.log('Delete selected nodes');
  };

  // Zoom controls
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 25));
  };

  const resetZoom = () => {
    setZoom(100);
  };

  // Group/Ungroup functionality
  const groupSelected = () => {
    console.log('Group selected nodes');
  };

  const ungroupSelected = () => {
    console.log('Ungroup selected nodes');
  };

  // Layer management
  const bringToFront = () => {
    console.log('Bring selected to front');
  };

  const sendToBack = () => {
    console.log('Send selected to back');
  };

  // Connection tools
  const toggleConnections = () => {
    console.log('Toggle connection mode');
  };

  const autoLayout = () => {
    console.log('Auto layout nodes');
  };

  // View controls
  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const toggleGuides = () => {
    setShowGuides(!showGuides);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={styles.editingToolbar}>
      {/* Zoom Level Dropdown - Left Side */}
      <div className={styles.toolbarSection}>
        <div className={styles.zoomLevelControl}>
          <FiFileText className={styles.documentIcon} />
          <select 
            className={styles.zoomLevelSelect}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          >
            <option value={25}>25%</option>
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
            <option value={200}>200%</option>
          </select>
        </div>
      </div>

      {/* Edit Operations - Left Side */}
      <div className={styles.toolbarSection}>
        <button 
          className={styles.toolbarBtn}
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo (Ctrl+Z)"
        >
          <FiRotateCcw />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo (Ctrl+Y)"
        >
          <FiRotateCw />
        </button>
      </div>







      {/* Clipboard Operations */}
      <div className={styles.toolbarSection}>
        <button 
          className={styles.toolbarBtn}
          onClick={copySelected}
          title="Copy (Ctrl+C)"
        >
          <FiCopy />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={paste}
          title="Paste (Ctrl+V)"
        >
          <FiClipboard />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={cut}
          title="Cut (Ctrl+X)"
        >
          <FiScissors />
        </button>
      </div>

      {/* Element Management */}
      <div className={styles.toolbarSection}>
        <button 
          className={styles.toolbarBtn}
          onClick={groupSelected}
          title="Group (Ctrl+G)"
        >
          <FiLayers />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={ungroupSelected}
          title="Ungroup (Ctrl+Shift+G)"
        >
          <FiMove />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={bringToFront}
          title="Bring to Front"
        >
          <FiEye />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={sendToBack}
          title="Send to Back"
        >
          <FiEyeOff />
        </button>
      </div>

      {/* Connection Tools */}
      <div className={styles.toolbarSection}>
        <button 
          className={styles.toolbarBtn}
          onClick={toggleConnections}
          title="Toggle Connections"
        >
          <FiLink />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={autoLayout}
          title="Auto Layout"
        >
          <FiGrid />
        </button>
      </div>

      {/* Add Elements */}
      <div className={styles.toolbarSection}>
        <button 
          className={styles.toolbarBtn}
          onClick={onSearch}
          title="Add Elements (Ctrl+F)"
        >
          <FiPlus />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={onSearch}
          title="Search"
        >
          <FiSearch />
        </button>
      </div>

      {/* View Controls */}
      <div className={styles.toolbarSection}>
        <button 
          className={`${styles.toolbarBtn} ${showGrid ? styles.active : ''}`}
          onClick={toggleGrid}
          title="Toggle Grid"
        >
          <FiGrid />
        </button>
        <button 
          className={`${styles.toolbarBtn} ${showGuides ? styles.active : ''}`}
          onClick={toggleGuides}
          title="Toggle Guides"
        >
          <FiSettings />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={toggleFullScreen}
          title="Toggle Full Screen"
        >
          {isFullScreen ? <FiMinimize2 /> : <FiMaximize2 />}
        </button>
      </div>

      {/* Document Operations - Right Corner */}
      <div className={styles.toolbarSection}>
        <button 
          className={styles.toolbarBtn}
          onClick={onSave}
          title="Save (Ctrl+S)"
        >
          <FiSave />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={onExport}
          title="Export"
        >
          <FiDownload />
        </button>
        <button 
          className={styles.toolbarBtn}
          onClick={onShare}
          title="Share"
        >
          <FiShare2 />
        </button>
      </div>

      {/* Execute Button - Right Corner */}
      <div className={styles.toolbarSection}>
        <ExecutionButton />
      </div>
    </div>
  );
};

export default EditingToolbar;
