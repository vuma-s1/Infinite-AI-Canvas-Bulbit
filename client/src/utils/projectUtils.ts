// Project management utilities for Bulbit AI Canvas

export interface ProjectData {
  id: string;
  templateType: string;
  timestamp: string;
  boxes: Array<{
    id: string;
    type: 'upload' | 'prompt' | 'output';
    title: string;
    value: string;
  }>;
  prompts: {
    styleTransfer?: {
      stylePrompt: string;
      objectPrompt: string;
    };
    colorExtractor?: {
      colorPrompt: string;
      objectPrompt: string;
    };
  };
}

export interface SaveProjectOptions {
  includeImages?: boolean;
  compressImages?: boolean;
  metadata?: Record<string, any>;
}

// Save project to localStorage
export const saveProject = (projectData: ProjectData): void => {
  try {
    const existingProjects = JSON.parse(localStorage.getItem('bulbitProjects') || '[]');
    const updatedProjects = [...existingProjects, projectData];
    localStorage.setItem('bulbitProjects', JSON.stringify(updatedProjects));
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
};

// Load all projects from localStorage
export const loadProjects = (): ProjectData[] => {
  try {
    return JSON.parse(localStorage.getItem('bulbitProjects') || '[]');
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
};

// Load projects by template type
export const loadProjectsByTemplate = (templateType: string): ProjectData[] => {
  const allProjects = loadProjects();
  return allProjects.filter(project => project.templateType === templateType);
};

// Delete project by ID
export const deleteProject = (projectId: string): void => {
  try {
    const existingProjects = JSON.parse(localStorage.getItem('bulbitProjects') || '[]');
    const updatedProjects = existingProjects.filter((project: ProjectData) => project.id !== projectId);
    localStorage.setItem('bulbitProjects', JSON.stringify(updatedProjects));
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
};

// Export project data for backend (removes image data to reduce size)
export const exportProjectForBackend = (projectData: ProjectData): Omit<ProjectData, 'boxes'> & {
  boxes: Array<Omit<ProjectData['boxes'][0], 'value'> & { hasImage: boolean; imageSize?: number }>;
} => {
  return {
    ...projectData,
    boxes: projectData.boxes.map(box => ({
      id: box.id,
      type: box.type,
      title: box.title,
      hasImage: box.value.startsWith('data:image'),
      imageSize: box.value.startsWith('data:image') ? box.value.length : undefined
    }))
  };
};

// Prepare project data for backend upload
export const prepareProjectForUpload = (projectData: ProjectData, options: SaveProjectOptions = {}): {
  metadata: Omit<ProjectData, 'boxes'> & {
    boxes: Array<Omit<ProjectData['boxes'][0], 'value'> & { hasImage: boolean; imageSize?: number }>;
  };
  images: Array<{ id: string; data: string; filename: string }>;
} => {
  const images: Array<{ id: string; data: string; filename: string }> = [];
  
  const metadata = {
    ...projectData,
    boxes: projectData.boxes.map(box => {
      if (box.value.startsWith('data:image')) {
        images.push({
          id: box.id,
          data: box.value,
          filename: `${box.id}_${Date.now()}.png`
        });
        return {
          id: box.id,
          type: box.type,
          title: box.title,
          hasImage: true,
          imageSize: box.value.length
        };
      }
      return {
        id: box.id,
        type: box.type,
        title: box.title,
        hasImage: false
      };
    })
  };

  return { metadata, images };
};

// Generate project summary for display
export const generateProjectSummary = (projectData: ProjectData): {
  templateType: string;
  date: string;
  imageCount: number;
  promptCount: number;
  totalSize: number;
} => {
  const imageCount = projectData.boxes.filter(box => box.value.startsWith('data:image')).length;
  const promptCount = projectData.boxes.filter(box => box.type === 'prompt' && box.value).length;
  const totalSize = projectData.boxes.reduce((acc, box) => acc + box.value.length, 0);

  return {
    templateType: projectData.templateType,
    date: new Date(projectData.timestamp).toLocaleDateString(),
    imageCount,
    promptCount,
    totalSize
  };
};
