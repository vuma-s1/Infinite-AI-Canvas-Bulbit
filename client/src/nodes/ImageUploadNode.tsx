import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './ImageUploadNode.module.css';
import { FiUpload, FiImage, FiX, FiZap } from 'react-icons/fi';

interface ImageUploadNodeData {
  imageUrl?: string;
  isLoading?: boolean;
  error?: string;
}

interface ImageUploadNodeProps {
  data: ImageUploadNodeData;
  id: string;
}

const ImageUploadNode: React.FC<ImageUploadNodeProps> = ({ data, id }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(data.imageUrl || null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateNodeData } = useWorkflowStore();

  const handleNodeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      updateNodeData(id, { imageUrl: objectUrl });
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    updateNodeData(id, { imageUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExtract = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imagePreview) return;

    setIsExtracting(true);
    updateNodeData(id, { isLoading: true, error: null });

    try {
      // Simulate extraction process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find connected nodes and update them
      const { edges, nodes } = useWorkflowStore.getState();
      const connectedEdges = edges.filter(edge => edge.source === id);
      
      connectedEdges.forEach(edge => {
        const targetNode = nodes.find(node => node.id === edge.target);
        if (targetNode) {
          useWorkflowStore.getState().updateNodeData(edge.target, { 
            imageUrl: imagePreview,
            isLoading: false 
          });
        }
      });
      
      updateNodeData(id, { isLoading: false });
    } catch (error) {
      console.error('Extraction failed:', error);
      updateNodeData(id, { isLoading: false, error: 'Extraction failed' });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className={styles.nodeContainer} onClick={handleNodeClick}>
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <FiUpload />
          </div>
          <div className={styles.title}>Image Upload</div>
        </div>
        
        {imagePreview ? (
          <>
            <div className={styles.imageContainer}>
              <img
                src={imagePreview}
                alt="Uploaded preview"
                className={styles.uploadedImage}
              />
              <button
                className={styles.removeButton}
                onClick={handleRemoveImage}
                title="Remove image"
              >
                <FiX />
              </button>
            </div>
            <button
              className={`${styles.extractButton} ${isExtracting ? styles.extracting : ''}`}
              onClick={handleExtract}
              disabled={isExtracting}
            >
              {isExtracting ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <FiZap className={styles.buttonIcon} />
                  <span>Extract</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.uploadIcon}>
              <FiImage />
            </div>
            <span>Click to upload image</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadNode;
