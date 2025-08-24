import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  history: Array<{ nodes: Node[]; edges: Edge[] }>;
  historyIndex: number;
  maxHistorySize: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  updateNodeData: (nodeId: string, data: any) => void;
  clearHistory: () => void;
  loadWorkflow: () => void;
  autoSave: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  setNodes: (nodes: Node[]) => {
    set({ nodes });
    get().addToHistory();
  },

  setEdges: (edges: Edge[]) => {
    set({ edges });
    get().addToHistory();
  },

  addToHistory: () => {
    const { nodes, edges, history, historyIndex, maxHistorySize } = get();
    const currentState = { nodes: [...nodes], edges: [...edges] };
    
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Add current state
    newHistory.push(currentState);
    
    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      set({
        nodes: [...previousState.nodes],
        edges: [...previousState.edges],
        historyIndex: historyIndex - 1
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        nodes: [...nextState.nodes],
        edges: [...nextState.edges],
        historyIndex: historyIndex + 1
      });
    }
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  updateNodeData: (nodeId: string, data: any) => {
    const { nodes } = get();
    const updatedNodes = nodes.map(node =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    );
    set({ nodes: updatedNodes });
    get().addToHistory();
  },

  clearHistory: () => {
    set({ history: [], historyIndex: -1 });
  },

  loadWorkflow: () => {
    try {
      const saved = localStorage.getItem('bulbit-workflow');
      if (saved) {
        const workflowData = JSON.parse(saved);
        set({ 
          nodes: workflowData.nodes || [], 
          edges: workflowData.edges || [],
          history: [],
          historyIndex: -1
        });
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
    }
  },

  autoSave: () => {
    try {
      const { nodes, edges } = get();
      const workflowData = { nodes, edges, timestamp: Date.now() };
      localStorage.setItem('bulbit-workflow', JSON.stringify(workflowData));
    } catch (error) {
      console.error('Failed to auto-save workflow:', error);
    }
  },
}));
