import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './StyleExtractorNode.module.css';
import { FiImage, FiZap } from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';

interface StyleExtractorNodeData {
  label: string;
  styleImageUrl?: string;
  objectImageUrl?: string;
  extractedStyle?: {
    colors: string[];
    textures: string[];
    lighting: string;
    mood: string;
    forms: string[];
  };
  isLoading?: boolean;
  error?: string;
}

interface StyleExtractorNodeProps {
  data: StyleExtractorNodeData;
  id: string;
}

const StyleExtractorNode: React.FC<StyleExtractorNodeProps> = ({ data, id }) => {
  const [styleImagePreview, setStyleImagePreview] = useState<string | null>(data.styleImageUrl || null);
  const [objectImagePreview, setObjectImagePreview] = useState<string | null>(data.objectImageUrl || null);
  const [isExtracting, setIsExtracting] = useState(false);
  const styleFileInputRef = useRef<HTMLInputElement>(null);
  const objectFileInputRef = useRef<HTMLInputElement>(null);
  const { updateNodeData } = useWorkflowStore();

  const handleStyleImageClick = () => {
    styleFileInputRef.current?.click();
  };

  const handleObjectImageClick = () => {
    objectFileInputRef.current?.click();
  };

  const handleStyleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setStyleImagePreview(objectUrl);
      updateNodeData(id, { styleImageUrl: objectUrl });
    }
  };

  const handleObjectFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setObjectImagePreview(objectUrl);
      updateNodeData(id, { objectImageUrl: objectUrl });
    }
  };

  const handleExtractStyle = async () => {
    if (!styleImagePreview || !objectImagePreview) {
      alert('Please upload both style and object images first!');
      return;
    }

    setIsExtracting(true);
    updateNodeData(id, { isLoading: true });

    try {
      // Simulate style extraction process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample extracted style
      const sampleStyle = {
        colors: ['#c0392b', '#922b21', '#7b241c', '#641e16'],
        textures: ['Smooth', 'Matte', 'Gradient'],
        lighting: 'Dramatic shadows',
        mood: 'Bold and confident',
        forms: ['Geometric', 'Angular', 'Modern']
      };

      updateNodeData(id, { 
        extractedStyle: sampleStyle,
        isLoading: false 
      });
    } catch (error) {
      console.error('Style extraction failed:', error);
      updateNodeData(id, { isLoading: false, error: 'Style extraction failed' });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className={styles.nodeContainer}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <MdPalette />
          </div>
          <div className={styles.title}>Style Extractor</div>
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.uploadArea}>
            <div className={styles.uploadTitle}>
              <MdPalette />
              <span>Style Reference</span>
            </div>
            <div 
              className={`${styles.imageUpload} ${styleImagePreview ? styles.hasImage : ''}`}
              onClick={handleStyleImageClick}
            >
              {styleImagePreview ? (
                <img src={styleImagePreview} alt="Style reference" className={styles.previewImage} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FiImage className={styles.uploadIcon} />
                  <span className={styles.uploadText}>Upload Style Image</span>
                </div>
              )}
            </div>
            <input
              ref={styleFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleStyleFileChange}
              className={styles.hiddenInput}
            />
          </div>

          <div className={styles.uploadArea}>
            <div className={styles.uploadTitle}>
              <FiImage />
              <span>Object Reference</span>
            </div>
            <div 
              className={`${styles.imageUpload} ${objectImagePreview ? styles.hasImage : ''}`}
              onClick={handleObjectImageClick}
            >
              {objectImagePreview ? (
                <img src={objectImagePreview} alt="Object reference" className={styles.previewImage} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FiImage className={styles.uploadIcon} />
                  <span className={styles.uploadText}>Upload Object Image</span>
                </div>
              )}
            </div>
            <input
              ref={objectFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleObjectFileChange}
              className={styles.hiddenInput}
            />
          </div>
        </div>

        <button
          className={`${styles.extractButton} ${isExtracting ? styles.extracting : ''}`}
          onClick={handleExtractStyle}
          disabled={isExtracting || !styleImagePreview || !objectImagePreview}
        >
          {isExtracting ? (
            <>
              <div className={styles.buttonSpinner}></div>
              <span>Extracting Style...</span>
            </>
          ) : (
            <>
              <FiZap className={styles.buttonIcon} />
              <span>Extract Style</span>
            </>
          )}
        </button>

        {data.isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <span>Extracting style...</span>
          </div>
        )}

        {data.error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{data.error}</span>
          </div>
        )}

        {data.extractedStyle && (
          <div className={styles.styleInfo}>
            <h4 className={styles.styleTitle}>Extracted Style</h4>
            <div className={styles.styleGrid}>
              <div className={styles.styleItem}>
                <span className={styles.styleLabel}>Colors:</span>
                <div className={styles.colorPalette}>
                  {data.extractedStyle.colors.map((color, index) => (
                    <div 
                      key={index} 
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.styleItem}>
                <span className={styles.styleLabel}>Mood:</span>
                <span className={styles.styleValue}>{data.extractedStyle.mood}</span>
              </div>
              <div className={styles.styleItem}>
                <span className={styles.styleLabel}>Lighting:</span>
                <span className={styles.styleValue}>{data.extractedStyle.lighting}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
};

export default StyleExtractorNode;
