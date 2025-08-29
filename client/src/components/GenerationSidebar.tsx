import React, { useState } from 'react';
import { FiX, FiImage, FiMessageSquare, FiDownload, FiSquare, FiCircle, FiType } from 'react-icons/fi';
import styles from './GenerationSidebar.module.css';

interface GenerationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  templateType: string;
}

const GenerationSidebar: React.FC<GenerationSidebarProps> = ({ 
  isOpen, 
  onClose, 
  templateType 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShapes, setShowShapes] = useState(false);

  // Multiple sample images based on template type and prompt content
  const getSampleImages = (prompt: string, templateType: string): string[] => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Basic Generation - Text to Image
    if (templateType === 'Basic Generation') {
      if (lowerPrompt.includes('landscape') || lowerPrompt.includes('mountain')) {
        return [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&sat=-50',
          'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop&sat=50'
        ];
      } else if (lowerPrompt.includes('portrait') || lowerPrompt.includes('person')) {
        return [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&sat=-30',
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&sat=30'
        ];
      } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog')) {
        return [
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1543852786-1cf6624b998d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&sat=-40',
          'https://images.unsplash.com/photo-1543852786-1cf6624b998d?w=400&h=300&fit=crop&sat=40'
        ];
      } else if (lowerPrompt.includes('city') || lowerPrompt.includes('urban')) {
        return [
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&sat=-60',
          'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400&h=300&fit=crop&sat=60'
        ];
      } else if (lowerPrompt.includes('abstract') || lowerPrompt.includes('art')) {
        return [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&sat=-70',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&sat=70'
        ];
      } else {
        return [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
        ];
      }
    }
    
    // Style Transfer
    if (templateType === 'Style Transfer') {
      if (lowerPrompt.includes('vintage') || lowerPrompt.includes('retro')) {
        return [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&sat=-50',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&sat=50',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&blur=2'
        ];
      } else if (lowerPrompt.includes('watercolor') || lowerPrompt.includes('painting')) {
        return [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&sat=-30',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&sat=30',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&blur=1'
        ];
      } else if (lowerPrompt.includes('sketch') || lowerPrompt.includes('drawing')) {
        return [
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&sat=-80',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&sat=80',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&blur=3'
        ];
      } else {
        return [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
        ];
      }
    }
    
    // Color Extraction
    if (templateType === 'Color Extraction') {
      return [
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop&sat=50',
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop&sat=-50',
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop&hue=180'
      ];
    }
    
    // Moodboard Generator
    if (templateType === 'Moodboard Generator') {
      return [
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
      ];
    }
    
    // Asset Generator
    if (templateType === 'Asset Generator') {
      return [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&sat=40',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&sat=-40',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&hue=90'
      ];
    }
    

    
    // Default fallback
    return [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
    ];
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation process with realistic delay
    setTimeout(() => {
      const sampleImages = getSampleImages(prompt, templateType);
      setGeneratedImages(sampleImages);
      setCurrentImageIndex(0);
      setIsGenerating(false);
    }, 2000 + Math.random() * 1000); // Random delay between 2-3 seconds
  };

  const handleNextImage = () => {
    if (generatedImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % generatedImages.length);
    }
  };

  const handlePreviousImage = () => {
    if (generatedImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + generatedImages.length) % generatedImages.length);
    }
  };

  const handleDownload = () => {
    if (generatedImages.length > 0) {
      const link = document.createElement('a');
      link.href = generatedImages[currentImageIndex];
      link.download = `generated-${templateType.toLowerCase().replace(/\s+/g, '-')}-${currentImageIndex + 1}.jpg`;
      link.click();
    }
  };

  const handleDragStart = (e: React.DragEvent, imageUrl: string, index: number) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: 'imageOutputNode',
      label: `Generated Image ${index + 1}`,
      data: { 
        imageUrl: imageUrl,
        prompt: prompt,
        templateType: templateType
      }
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleShapeDragStart = (e: React.DragEvent, nodeType: string, label: string, data?: any) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      label: label,
      data: data
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {showShapes ? 'Design Shapes' : templateType}
        </h3>
        <div className={styles.headerActions}>
          <button 
            className={styles.shapesBtn}
            onClick={() => setShowShapes(!showShapes)}
            title={showShapes ? "Back to Generation" : "Back to Shapes"}
          >
            {showShapes ? <FiImage size={16} /> : <FiSquare size={16} />}
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {showShapes ? (
          // Shapes Section
          <div className={styles.shapesSection}>
            <div className={styles.sectionHeader}>
              <FiSquare size={16} />
              <span>Basic Shapes</span>
            </div>
            <div className={styles.shapesGrid}>
              <button 
                className={styles.shapeBtn}
                draggable
                onDragStart={(e) => handleShapeDragStart(e, 'rectangleNode', 'Rectangle', { width: 100, height: 60, strokeWidth: 2 })}
              >
                <FiSquare size={24} />
                <span>Rectangle</span>
              </button>
              
              <button 
                className={styles.shapeBtn}
                draggable
                onDragStart={(e) => handleShapeDragStart(e, 'circleNode', 'Circle', { radius: 50, strokeWidth: 2 })}
              >
                <FiCircle size={24} />
                <span>Circle</span>
              </button>
              
              <button 
                className={styles.shapeBtn}
                draggable
                onDragStart={(e) => handleShapeDragStart(e, 'textNode', 'Text', { text: 'Edit Text' })}
              >
                <FiType size={24} />
                <span>Text</span>
              </button>
            </div>

            <div className={styles.sectionHeader} style={{ marginTop: '24px' }}>
              <FiImage size={16} />
              <span>AI Nodes</span>
            </div>
            <div className={styles.shapesGrid}>
              <button 
                className={styles.shapeBtn}
                draggable
                onDragStart={(e) => handleShapeDragStart(e, 'promptNode', 'Text Prompt')}
              >
                <FiMessageSquare size={24} />
                <span>Prompt</span>
              </button>
              
              <button 
                className={styles.shapeBtn}
                draggable
                onDragStart={(e) => handleShapeDragStart(e, 'imageUploadNode', 'Image Upload')}
              >
                <FiImage size={24} />
                <span>Upload</span>
              </button>
            </div>
          </div>
        ) : (
          // Generation Section
          <>
            {/* Prompt Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FiMessageSquare size={16} />
                <span>Prompt</span>
              </div>
              <textarea
                className={styles.promptInput}
                placeholder={`Enter your ${templateType.toLowerCase()} prompt here...`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
              <button 
                className={styles.generateBtn}
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {/* Generated Images Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FiImage size={16} />
                <span>Generated Images</span>
                {generatedImages.length > 0 && (
                  <span className={styles.imageCounter}>
                    {currentImageIndex + 1} / {generatedImages.length}
                  </span>
                )}
              </div>
              <div className={styles.imageContainer}>
                {isGenerating ? (
                  <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <span>Generating your {templateType.toLowerCase()}...</span>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className={styles.imageWrapper}>
                    <img 
                      src={generatedImages[currentImageIndex]} 
                      alt="Generated" 
                      className={styles.generatedImage}
                      draggable
                      onDragStart={(e) => handleDragStart(e, generatedImages[currentImageIndex], currentImageIndex)}
                    />
                    
                    {/* Image Navigation */}
                    <div className={styles.imageNavigation}>
                      <button 
                        className={styles.navBtn}
                        onClick={handlePreviousImage}
                        disabled={generatedImages.length <= 1}
                      >
                        ‹
                      </button>
                      <span className={styles.imageCounter}>
                        {currentImageIndex + 1} / {generatedImages.length}
                      </span>
                      <button 
                        className={styles.navBtn}
                        onClick={handleNextImage}
                        disabled={generatedImages.length <= 1}
                      >
                        ›
                      </button>
                    </div>

                    {/* Image Actions */}
                    <div className={styles.imageActions}>
                      <button className={styles.downloadBtn} onClick={handleDownload}>
                        <FiDownload size={16} />
                        Download
                      </button>
                      <div className={styles.imageInfo}>
                        <span className={styles.promptText}>"{prompt}"</span>
                      </div>
                    </div>

                    {/* Thumbnail Grid */}
                    <div className={styles.thumbnailGrid}>
                      {generatedImages.map((image, index) => (
                        <div 
                          key={index}
                          className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, image, index)}
                        >
                          <img 
                            src={image} 
                            alt={`Generated ${index + 1}`}
                            className={styles.thumbnailImage}
                          />
                          <span className={styles.thumbnailNumber}>{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.placeholder}>
                    <FiImage size={48} />
                    <span>Generated images will appear here</span>
                    <span className={styles.placeholderHint}>
                      Try prompts like: "mountain landscape", "portrait of a person", "abstract art", "vintage style", etc.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerationSidebar;
