import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './MoodboardExtractorNode.module.css';
import { 
  FiClipboard, 
  FiImage, 
  FiZap, 
  FiHome, 
  FiType, 
  FiGrid, 
  FiLayers, 
  FiSmartphone, 
  FiZap as FiZapIcon 
} from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';

interface MoodboardExtractorNodeData {
  label: string;
  logoUrl?: string;
  colorPaletteUrl?: string;
  fontPairingUrl?: string;
  designStyleUrl?: string;
  patternUrl?: string;
  texturesUrl?: string;
  mockupsUrl?: string;
  iconsUrl?: string;
  prompt?: string;
  isLoading?: boolean;
  error?: string;
}

interface MoodboardExtractorNodeProps {
  data: MoodboardExtractorNodeData;
  id: string;
}

const MoodboardExtractorNode: React.FC<MoodboardExtractorNodeProps> = ({ data, id }) => {
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({
    logo: data.logoUrl || '',
    colorPalette: data.colorPaletteUrl || '',
    fontPairing: data.fontPairingUrl || '',
    designStyle: data.designStyleUrl || '',
    pattern: data.patternUrl || '',
    textures: data.texturesUrl || '',
    mockups: data.mockupsUrl || '',
    icons: data.iconsUrl || ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { updateNodeData } = useWorkflowStore();

  const uploadFields = [
    { key: 'logo', label: 'Main Logo', icon: <FiHome /> },
    { key: 'colorPalette', label: 'Color Palette', icon: <MdPalette /> },
    { key: 'fontPairing', label: 'Font Pairing', icon: <FiType /> },
    { key: 'designStyle', label: 'Design Style', icon: <FiGrid /> },
    { key: 'pattern', label: 'Pattern', icon: <FiLayers /> },
    { key: 'textures', label: 'Textures', icon: <FiLayers /> },
    { key: 'mockups', label: 'Product Mockups', icon: <FiSmartphone /> },
    { key: 'icons', label: 'Icon Sets', icon: <FiZapIcon /> }
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

  const handleGenerateMoodboard = async () => {
    const uploadedCount = Object.values(uploadedImages).filter(Boolean).length;
    if (uploadedCount < 3) {
      alert('Please upload at least 3 elements to generate a moodboard!');
      return;
    }

    setIsGenerating(true);
    updateNodeData(id, { isLoading: true });

    try {
      // Simulate moodboard generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate sample moodboard data
      const sampleMoodboard = {
        theme: 'Modern Minimalist',
        colors: ['#ff6b6b', '#e74c3c', '#c0392b', '#a93226'],
        fonts: ['Inter', 'Poppins'],
        style: 'Clean and Professional'
      };

      updateNodeData(id, { 
        prompt: `Generated ${sampleMoodboard.theme} moodboard with ${sampleMoodboard.colors.length} colors`,
        isLoading: false 
      });
    } catch (error) {
      console.error('Moodboard generation failed:', error);
      updateNodeData(id, { isLoading: false, error: 'Moodboard generation failed' });
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
            <FiClipboard />
          </div>
          <div className={styles.title}>Moodboard Generator</div>
        </div>

        <div className={styles.uploadGrid}>
          {uploadFields.map((field) => (
            <div key={field.key} className={styles.uploadField}>
              <div className={styles.fieldTitle}>
                <span className={styles.fieldIcon}>{field.icon}</span>
                <span>{field.label}</span>
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

        <div className={styles.promptSection}>
          <div className={styles.promptTitle}>
            <FiClipboard />
            <span>Moodboard Description</span>
          </div>
          <textarea
            className={styles.promptInput}
            placeholder="Describe the moodboard you want to generate..."
            value={data.prompt || ''}
            onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
            rows={3}
          />
        </div>

        <button
          className={`${styles.generateButton} ${isGenerating ? styles.generating : ''}`}
          onClick={handleGenerateMoodboard}
          disabled={isGenerating || Object.values(uploadedImages).filter(Boolean).length < 3}
        >
          {isGenerating ? (
            <>
              <div className={styles.buttonSpinner}></div>
              <span>Generating Moodboard...</span>
            </>
          ) : (
            <>
              <FiZap className={styles.buttonIcon} />
              <span>Generate Moodboard</span>
            </>
          )}
        </button>

        {data.isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <span>Generating moodboard...</span>
          </div>
        )}

        {data.error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{data.error}</span>
          </div>
        )}

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Elements:</span>
            <span className={styles.statValue}>
              {Object.values(uploadedImages).filter(Boolean).length}/8
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Status:</span>
            <span className={styles.statValue}>
              {Object.values(uploadedImages).filter(Boolean).length >= 3 ? 'Ready' : 'Need more elements'}
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
};

export default MoodboardExtractorNode;
