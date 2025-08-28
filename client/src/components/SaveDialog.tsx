import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { FiSave, FiX, FiTag, FiEdit3, FiClock, FiDownload, FiTrash2, FiCopy } from 'react-icons/fi';
import styles from './SaveDialog.module.css';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load' | 'export';
  projectId?: string;
}

const SaveDialog: React.FC<SaveDialogProps> = ({ isOpen, onClose, mode, projectId }) => {
  const { 
    savedProjects, 
    currentProjectId,
    saveProject, 
    loadProject, 
    deleteProject, 
    exportProject,
    duplicateProject,
    updateProject 
  } = useWorkflowStore();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTags, setProjectTags] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && mode === 'save' && currentProjectId) {
      const currentProject = savedProjects.find(p => p.id === currentProjectId);
      if (currentProject) {
        setProjectName(currentProject.name);
        setProjectDescription(currentProject.description || '');
        setProjectTags(currentProject.tags?.join(', ') || '');
      }
    }
  }, [isOpen, mode, currentProjectId, savedProjects]);

  const handleSave = () => {
    if (!projectName.trim()) return;
    
    const tags = projectTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (currentProjectId) {
      // Update existing project
      updateProject(currentProjectId, {
        name: projectName,
        description: projectDescription,
        tags,
        updatedAt: Date.now()
      });
    } else {
      // Create new project
      saveProject(projectName, projectDescription, tags);
    }
    
    onClose();
    setProjectName('');
    setProjectDescription('');
    setProjectTags('');
  };

  const handleLoad = (projectId: string) => {
    loadProject(projectId);
    onClose();
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
    }
  };

  const handleDuplicate = (projectId: string) => {
    duplicateProject(projectId);
  };

  const handleExport = (projectId: string, format: 'json' | 'png') => {
    exportProject(projectId, format);
  };

  const filteredProjects = savedProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === 'save' && 'Save Project'}
            {mode === 'load' && 'Load Project'}
            {mode === 'export' && 'Export Project'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.content}>
          {mode === 'save' && (
            <div className={styles.saveForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Name *</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className={styles.input}
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project..."
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FiTag className={styles.labelIcon} />
                  Tags
                </label>
                <input
                  type="text"
                  value={projectTags}
                  onChange={(e) => setProjectTags(e.target.value)}
                  placeholder="Enter tags separated by commas..."
                  className={styles.input}
                />
              </div>

              <div className={styles.saveActions}>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={!projectName.trim()}
                >
                  <FiSave />
                  {currentProjectId ? 'Update Project' : 'Save Project'}
                </button>
                <button className={styles.cancelButton} onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {(mode === 'load' || mode === 'export') && (
            <div className={styles.projectList}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects..."
                  className={styles.searchInput}
                />
              </div>

              {filteredProjects.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No projects found</p>
                  {searchTerm && (
                    <button 
                      className={styles.clearSearch}
                      onClick={() => setSearchTerm('')}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.projectsGrid}>
                  {filteredProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className={`${styles.projectCard} ${selectedProject === project.id ? styles.selected : ''}`}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <div className={styles.projectThumbnail}>
                        {project.thumbnail ? (
                          <img src={project.thumbnail} alt={project.name} />
                        ) : (
                          <div className={styles.placeholderThumbnail}>
                            <FiEdit3 />
                          </div>
                        )}
                      </div>

                      <div className={styles.projectInfo}>
                        <h3 className={styles.projectName}>{project.name}</h3>
                        {project.description && (
                          <p className={styles.projectDescription}>{project.description}</p>
                        )}
                        <div className={styles.projectMeta}>
                          <span className={styles.projectDate}>
                            <FiClock />
                            {formatDate(project.updatedAt)}
                          </span>
                          {project.tags && project.tags.length > 0 && (
                            <div className={styles.projectTags}>
                              {project.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className={styles.tag}>{tag}</span>
                              ))}
                              {project.tags.length > 3 && (
                                <span className={styles.moreTags}>+{project.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.projectActions}>
                        {mode === 'load' && (
                          <button 
                            className={styles.actionButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoad(project.id);
                            }}
                            title="Load Project"
                          >
                            <FiEdit3 />
                          </button>
                        )}
                        
                        {mode === 'export' && (
                          <>
                            <button 
                              className={styles.actionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExport(project.id, 'json');
                              }}
                              title="Export as JSON"
                            >
                              <FiDownload />
                            </button>
                            <button 
                              className={styles.actionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExport(project.id, 'png');
                              }}
                              title="Export as PNG"
                            >
                              <FiDownload />
                            </button>
                          </>
                        )}

                        <button 
                          className={styles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(project.id);
                          }}
                          title="Duplicate Project"
                        >
                          <FiCopy />
                        </button>

                        <button 
                          className={styles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          title="Delete Project"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveDialog;
