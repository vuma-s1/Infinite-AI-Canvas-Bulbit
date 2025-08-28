import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './ColorExtractorNode.module.css';
import { FiDroplet, FiImage, FiZap, FiX } from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';

interface ColorExtractorNodeData {
  label: string;
  colorReferenceUrl?: string;
  objectReferenceUrl?: string;
  extractedPalette?: string[];
  allPalettes?: string[][];
  colorMapping?: Record<string, string>;
  isLoading?: boolean;
  error?: string;
}

interface ColorExtractorNodeProps {
  data: ColorExtractorNodeData;
  id: string;
}

const ColorExtractorNode: React.FC<ColorExtractorNodeProps> = ({ data, id }) => {
  const [colorImagePreview, setColorImagePreview] = useState<string | null>(data.colorReferenceUrl || null);
  const [objectImagePreview, setObjectImagePreview] = useState<string | null>(data.objectReferenceUrl || null);
  const [isExtracting, setIsExtracting] = useState(false);
  const colorFileInputRef = useRef<HTMLInputElement>(null);
  const objectFileInputRef = useRef<HTMLInputElement>(null);
  const { updateNodeData } = useWorkflowStore();

  const handleColorImageClick = () => {
    colorFileInputRef.current?.click();
  };

  const handleObjectImageClick = () => {
    objectFileInputRef.current?.click();
  };

  const handleColorFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setColorImagePreview(objectUrl);
      updateNodeData(id, { colorReferenceUrl: objectUrl });
    }
  };

  const handleObjectFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setObjectImagePreview(objectUrl);
      updateNodeData(id, { objectReferenceUrl: objectUrl });
    }
  };

  const handleRemoveColorImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setColorImagePreview(null);
    updateNodeData(id, { colorReferenceUrl: null });
    if (colorFileInputRef.current) {
      colorFileInputRef.current.value = '';
    }
  };

  const handleRemoveObjectImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setObjectImagePreview(null);
    updateNodeData(id, { objectReferenceUrl: null });
    if (objectFileInputRef.current) {
      objectFileInputRef.current.value = '';
    }
  };

  const handleExtractColors = async () => {
    if (!colorImagePreview && !objectImagePreview) {
      alert('Please upload at least one image first!');
      return;
    }

    setIsExtracting(true);
    updateNodeData(id, { isLoading: true });

    try {
      // Simulate color extraction process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate multiple sample color palettes
      const samplePalettes = [
        ['#ff6b6b', '#e74c3c', '#c0392b', '#a93226', '#922b21'],
        ['#3498db', '#2980b9', '#1f618d', '#154360', '#0e3a5f'],
        ['#2ecc71', '#27ae60', '#1e8449', '#145a32', '#0e3a1e'],
        ['#f39c12', '#e67e22', '#d35400', '#a04000', '#7d3c00']
      ];
      
      const sampleMappings = [
        {
          '#ff6b6b': '#ff8a80',
          '#e74c3c': '#ff5252',
          '#c0392b': '#d32f2f'
        },
        {
          '#3498db': '#5dade2',
          '#2980b9': '#3498db',
          '#1f618d': '#2874a6'
        }
      ];
      
      // Select random palette and mapping
      const selectedPalette = samplePalettes[Math.floor(Math.random() * samplePalettes.length)];
      const selectedMapping = sampleMappings[Math.floor(Math.random() * sampleMappings.length)];

      updateNodeData(id, { 
        extractedPalette: selectedPalette,
        colorMapping: selectedMapping,
        allPalettes: samplePalettes,
        isLoading: false 
      });
    } catch (error) {
      console.error('Color extraction failed:', error);
      updateNodeData(id, { isLoading: false, error: 'Color extraction failed' });
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
            <FiDroplet />
          </div>
          <div className={styles.title}>Color Extractor</div>
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.uploadArea}>
            <div className={styles.uploadTitle}>
              <MdPalette />
              <span>Color Reference</span>
            </div>
            <div 
              className={`${styles.imageUpload} ${colorImagePreview ? styles.hasImage : ''}`}
              onClick={handleColorImageClick}
            >
              {colorImagePreview ? (
                <div className={styles.imageContainer}>
                  <img src={colorImagePreview} alt="Color reference" className={styles.previewImage} />
                  <button
                    className={styles.removeButton}
                    onClick={handleRemoveColorImage}
                    title="Remove image"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FiImage className={styles.uploadIcon} />
                  <span className={styles.uploadText}>Upload Color Image</span>
                </div>
              )}
            </div>
            <input
              ref={colorFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleColorFileChange}
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
                <div className={styles.imageContainer}>
                  <img src={objectImagePreview} alt="Object reference" className={styles.previewImage} />
                  <button
                    className={styles.removeButton}
                    onClick={handleRemoveObjectImage}
                    title="Remove image"
                  >
                    <FiX />
                  </button>
                </div>
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
          onClick={handleExtractColors}
          disabled={isExtracting || (!colorImagePreview && !objectImagePreview)}
        >
          {isExtracting ? (
            <>
              <div className={styles.buttonSpinner}></div>
              <span>Extracting Colors...</span>
            </>
          ) : (
            <>
              <FiZap className={styles.buttonIcon} />
              <span>Extract Colors</span>
            </>
          )}
        </button>

        {data.isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <span>Extracting colors...</span>
          </div>
        )}

        {data.error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{data.error}</span>
          </div>
        )}

        {data.extractedPalette && (
          <div className={styles.paletteInfo}>
            <h4 className={styles.paletteTitle}>Extracted Palette</h4>
            <div className={styles.colorPalette}>
              {data.extractedPalette.map((color, index) => (
                <div 
                  key={index} 
                  className={styles.colorSwatch}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <span className={styles.colorCode}>{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.allPalettes && data.allPalettes.length > 1 && (
          <div className={styles.allPalettes}>
            <h4 className={styles.palettesTitle}>All Generated Palettes:</h4>
            <div className={styles.palettesGrid}>
              {data.allPalettes.map((palette, paletteIndex) => (
                <div key={paletteIndex} className={styles.paletteItem}>
                  <div className={styles.paletteNumber}>Palette {paletteIndex + 1}</div>
                  <div className={styles.paletteColors}>
                    {palette.map((color, colorIndex) => (
                      <div 
                        key={colorIndex} 
                        className={styles.paletteSwatch}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.colorMapping && (
          <div className={styles.mappingInfo}>
            <h4 className={styles.mappingTitle}>Color Mapping</h4>
            <div className={styles.mappingGrid}>
              {Object.entries(data.colorMapping).map(([from, to], index) => (
                <div key={index} className={styles.mappingItem}>
                  <div className={styles.mappingFrom}>
                    <div 
                      className={styles.colorDot}
                      style={{ backgroundColor: from }}
                    />
                    <span className={styles.colorCode}>{from}</span>
                  </div>
                  <div className={styles.mappingArrow}>→</div>
                  <div className={styles.mappingTo}>
                    <div 
                      className={styles.colorDot}
                      style={{ backgroundColor: to }}
                    />
                    <span className={styles.colorCode}>{to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
};

export default ColorExtractorNode;
