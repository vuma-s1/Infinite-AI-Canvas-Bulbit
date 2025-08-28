import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface SavedProject {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  template?: string;
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  history: Array<{ nodes: Node[]; edges: Edge[] }>;
  historyIndex: number;
  maxHistorySize: number;
  savedProjects: SavedProject[];
  currentProjectId: string | null;
  autoSaveInterval: number | null;
  lastAutoSave: number;
  
  // Existing methods
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
  
  // New save/load methods
  saveProject: (name: string, description?: string, tags?: string[]) => string;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<SavedProject>) => void;
  exportProject: (projectId: string, format: 'json' | 'png') => void;
  importProject: (projectData: SavedProject) => void;
  startAutoSave: () => void;
  stopAutoSave: () => void;
  getProjectThumbnail: () => string;
  duplicateProject: (projectId: string) => string;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,
  savedProjects: [],
  currentProjectId: null,
  autoSaveInterval: null,
  lastAutoSave: Date.now(),

  setNodes: (nodes: Node[]) => {
    set({ nodes });
    get().addToHistory();
    get().triggerAutoSave();
  },

  setEdges: (edges: Edge[]) => {
    set({ edges });
    get().addToHistory();
    get().triggerAutoSave();
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
    get().triggerAutoSave();
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
      const { nodes, edges, currentProjectId } = get();
      if (currentProjectId) {
        // Update existing project
        get().updateProject(currentProjectId, {
          nodes: [...nodes],
          edges: [...edges],
          updatedAt: Date.now()
        });
      } else {
        // Save as temporary project
        const workflowData = { nodes, edges, timestamp: Date.now() };
        localStorage.setItem('bulbit-workflow-temp', JSON.stringify(workflowData));
      }
      set({ lastAutoSave: Date.now() });
    } catch (error) {
      console.error('Failed to auto-save workflow:', error);
    }
  },

  // New save/load methods
  saveProject: (name: string, description?: string, tags?: string[]) => {
    const { nodes, edges, savedProjects } = get();
    const projectId = `project-${Date.now()}`;
    const now = Date.now();
    
    const newProject: SavedProject = {
      id: projectId,
      name,
      description,
      nodes: [...nodes],
      edges: [...edges],
      thumbnail: get().getProjectThumbnail(),
      createdAt: now,
      updatedAt: now,
      tags: tags || []
    };

    const updatedProjects = [...savedProjects, newProject];
    
    // Save to localStorage
    localStorage.setItem('bulbit-projects', JSON.stringify(updatedProjects));
    
    set({ 
      savedProjects: updatedProjects,
      currentProjectId: projectId
    });

    return projectId;
  },

  loadProject: (projectId: string) => {
    const { savedProjects } = get();
    const project = savedProjects.find(p => p.id === projectId);
    
    if (project) {
      set({
        nodes: [...project.nodes],
        edges: [...project.edges],
        currentProjectId: projectId,
        history: [],
        historyIndex: -1
      });
    }
  },

  deleteProject: (projectId: string) => {
    const { savedProjects, currentProjectId } = get();
    const updatedProjects = savedProjects.filter(p => p.id !== projectId);
    
    localStorage.setItem('bulbit-projects', JSON.stringify(updatedProjects));
    
    set({ 
      savedProjects: updatedProjects,
      currentProjectId: currentProjectId === projectId ? null : currentProjectId
    });
  },

  updateProject: (projectId: string, updates: Partial<SavedProject>) => {
    const { savedProjects } = get();
    const updatedProjects = savedProjects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    
    localStorage.setItem('bulbit-projects', JSON.stringify(updatedProjects));
    set({ savedProjects: updatedProjects });
  },

  exportProject: (projectId: string, format: 'json' | 'png') => {
    const { savedProjects } = get();
    const project = savedProjects.find(p => p.id === projectId);
    
    if (!project) return;

    if (format === 'json') {
      const dataStr = JSON.stringify(project, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      // TODO: Implement PNG export with canvas screenshot
      console.log('PNG export not yet implemented');
    }
  },

  importProject: (projectData: SavedProject) => {
    const { savedProjects } = get();
    const updatedProjects = [...savedProjects, projectData];
    
    localStorage.setItem('bulbit-projects', JSON.stringify(updatedProjects));
    set({ savedProjects: updatedProjects });
  },

  startAutoSave: () => {
    const interval = setInterval(() => {
      get().autoSave();
    }, 30000); // Auto-save every 30 seconds
    
    set({ autoSaveInterval: interval });
  },

  stopAutoSave: () => {
    const { autoSaveInterval } = get();
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
      set({ autoSaveInterval: null });
    }
  },

  getProjectThumbnail: () => {
    // TODO: Generate thumbnail from current canvas state
    // For now, return a placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMkQzNDQwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QnVsYml0IEFJPC90ZXh0Pgo8L3N2Zz4K';
  },

  duplicateProject: (projectId: string) => {
    const { savedProjects } = get();
    const project = savedProjects.find(p => p.id === projectId);
    
    if (!project) return projectId;

    const newProjectId = `project-${Date.now()}`;
    const duplicatedProject: SavedProject = {
      ...project,
      id: newProjectId,
      name: `${project.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updatedProjects = [...savedProjects, duplicatedProject];
    localStorage.setItem('bulbit-projects', JSON.stringify(updatedProjects));
    set({ savedProjects: updatedProjects });

    return newProjectId;
  },

  triggerAutoSave: () => {
    const { lastAutoSave } = get();
    const now = Date.now();
    
    // Only auto-save if 10 seconds have passed since last save
    if (now - lastAutoSave > 10000) {
      get().autoSave();
    }
  }
}));

// Load saved projects on store initialization
const savedProjects = localStorage.getItem('bulbit-projects');
if (savedProjects) {
  try {
    const projects = JSON.parse(savedProjects);
    useWorkflowStore.setState({ savedProjects: projects });
  } catch (error) {
    console.error('Failed to load saved projects:', error);
  }
}
