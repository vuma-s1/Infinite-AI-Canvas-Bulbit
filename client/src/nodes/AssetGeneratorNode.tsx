import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './AssetGeneratorNode.module.css';
import { 
  FiPackage, 
  FiImage, 
  FiZap, 
  FiGrid, 
  FiSmartphone, 
  FiEdit3 
} from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';

interface AssetGeneratorNodeData {
  label: string;
  brandingSourceUrl?: string;
  illustrationsUrl?: string;
  mockupsUrl?: string;
  sketchesUrl?: string;
  extractedBranding?: {
    colors: string[];
    style: string;
    typography: string;
    visualElements: string[];
  };
  isLoading?: boolean;
  error?: string;
}

interface AssetGeneratorNodeProps {
  data: AssetGeneratorNodeData;
  id: string;
}

const AssetGeneratorNode: React.FC<AssetGeneratorNodeProps> = ({ data, id }) => {
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({
    brandingSource: data.brandingSourceUrl || '',
    illustrations: data.illustrationsUrl || '',
    mockups: data.mockupsUrl || '',
    sketches: data.sketchesUrl || ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { updateNodeData } = useWorkflowStore();

  const uploadFields = [
    { key: 'brandingSource', label: 'Branding Source', icon: <MdPalette />, required: true },
    { key: 'illustrations', label: 'Illustrations & Icons', icon: <FiGrid /> },
    { key: 'mockups', label: 'Landing Pages & Mockups', icon: <FiSmartphone /> },
    { key: 'sketches', label: 'Hand Drawn Sketches', icon: <FiEdit3 /> }
  ];

  const handleImageClick = (fieldKey: string) => {
    fileInputRefs.current[fieldKey]?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setUploadedImages(prev => ({ ...prev, [fieldKey]: objectUrl }));
      
      // Update the store with the new URL
      const updateData: any = {};
      updateData[`${fieldKey}Url`] = objectUrl;
      updateNodeData(id, updateData);
    }
  };

  const handleGenerateAssets = async () => {
    if (!uploadedImages.brandingSource) {
      alert('Please upload a branding source first!');
      return;
    }

    setIsGenerating(true);
    updateNodeData(id, { isLoading: true });

    try {
      // Simulate asset generation process
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate sample branding data
      const sampleBranding = {
        colors: ['#7b241c', '#641e16', '#4a1a12', '#2d0f0a'],
        style: 'Modern Minimalist',
        typography: 'Inter + Poppins',
        visualElements: ['Clean Lines', 'Geometric Shapes', 'Subtle Shadows']
      };

      updateNodeData(id, { 
        extractedBranding: sampleBranding,
        isLoading: false 
      });
    } catch (error) {
      console.error('Asset generation failed:', error);
      updateNodeData(id, { isLoading: false, error: 'Asset generation failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.nodeContainer}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <FiPackage />
          </div>
          <div className={styles.title}>Asset Generator</div>
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.sectionTitle}>
            <FiPackage />
            <span>Branding & Assets</span>
          </div>
          <div className={styles.uploadGrid}>
            {uploadFields.map((field) => (
              <div key={field.key} className={styles.uploadField}>
                <div className={styles.fieldTitle}>
                  <span className={styles.fieldIcon}>{field.icon}</span>
                  <span>{field.label}</span>
                  {field.required && <span className={styles.required}>*</span>}
                </div>
                <div 
                  className={`${styles.imageUpload} ${uploadedImages[field.key] ? styles.hasImage : ''}`}
                  onClick={() => handleImageClick(field.key)}
                >
                  {uploadedImages[field.key] ? (
                    <img src={uploadedImages[field.key]} alt={field.label} className={styles.previewImage} />
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <FiImage className={styles.uploadIcon} />
                      <span className={styles.uploadText}>Upload</span>
                    </div>
                  )}
                </div>
                <input
                  ref={(el) => fileInputRefs.current[field.key] = el}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.key)}
                  className={styles.hiddenInput}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${styles.generateButton} ${isGenerating ? styles.generating : ''}`}
          onClick={handleGenerateAssets}
          disabled={isGenerating || !uploadedImages.brandingSource}
        >
          {isGenerating ? (
            <>
              <div className={styles.buttonSpinner}></div>
              <span>Generating Assets...</span>
            </>
          ) : (
            <>
              <FiZap className={styles.buttonIcon} />
              <span>Generate Assets</span>
            </>
          )}
        </button>

        {data.isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <span>Generating branded assets...</span>
          </div>
        )}

        {data.error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{data.error}</span>
          </div>
        )}

        {data.extractedBranding && (
          <div className={styles.brandingInfo}>
            <h4 className={styles.brandingTitle}>Extracted Branding</h4>
            <div className={styles.brandingGrid}>
              <div className={styles.brandingItem}>
                <span className={styles.brandingLabel}>Style:</span>
                <span className={styles.brandingValue}>{data.extractedBranding.style}</span>
              </div>
              <div className={styles.brandingItem}>
                <span className={styles.brandingLabel}>Typography:</span>
                <span className={styles.brandingValue}>{data.extractedBranding.typography}</span>
              </div>
              <div className={styles.brandingItem}>
                <span className={styles.brandingLabel}>Colors:</span>
                <div className={styles.colorPalette}>
                  {data.extractedBranding.colors.map((color, index) => (
                    <div 
                      key={index} 
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.brandingItem}>
                <span className={styles.brandingLabel}>Elements:</span>
                <div className={styles.elementsList}>
                  {data.extractedBranding.visualElements.map((element, index) => (
                    <span key={index} className={styles.elementTag}>{element}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Assets:</span>
            <span className={styles.statValue}>
              {Object.values(uploadedImages).filter(Boolean).length}/4
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Status:</span>
            <span className={styles.statValue}>
              {uploadedImages.brandingSource ? 'Ready' : 'Need branding source'}
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
};

export default AssetGeneratorNode;
