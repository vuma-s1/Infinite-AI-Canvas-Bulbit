import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { FiUpload, FiMessageSquare, FiImage, FiZap, FiX, FiType, FiGrid, FiLayers, FiBox, FiFileText } from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';
import styles from './CenterCanvas.module.css';

interface CenterBox {
  id: string;
  type: 'upload' | 'prompt' | 'output';
  title: string;
  placeholder: string;
  value: string;
  icon: React.ReactNode;
  isActive: boolean;
}

interface CenterCanvasProps {
  isVisible: boolean;
  templateType: string | null;
  onClose: () => void;
}

const CenterCanvas: React.FC<CenterCanvasProps> = ({ isVisible, templateType, onClose }) => {
  const [centerBoxes, setCenterBoxes] = useState<CenterBox[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { updateNodeData } = useWorkflowStore();

  // Initialize center boxes based on template type
  useEffect(() => {
    if (templateType && isVisible) {
      const boxes = getCenterBoxesForTemplate(templateType);
      setCenterBoxes(boxes);
    }
  }, [templateType, isVisible]);

  const getCenterBoxesForTemplate = (template: string): CenterBox[] => {
    switch (template) {
      case 'Text-to-Image':
        return [
          {
            id: 'text-prompt',
            type: 'prompt',
            title: 'Text Prompt',
            placeholder: 'Enter your prompt... (e.g., "A beautiful landscape with mountains")',
            value: '',
            icon: <FiMessageSquare />,
            isActive: true
          },
          {
            id: 'output-image',
            type: 'output',
            title: 'Generated Image',
            placeholder: 'Generated image will appear here',
            value: '',
            icon: <FiImage />,
            isActive: false
          }
        ];

      case 'Style Transfer':
        return [
          {
            id: 'style-reference',
            type: 'upload',
            title: 'Style Reference',
            placeholder: 'Upload style reference image',
            value: '',
            icon: <FiUpload />,
            isActive: true
          },
          {
            id: 'content-image',
            type: 'upload',
            title: 'Object Reference',
            placeholder: 'Upload object reference image',
            value: '',
            icon: <FiUpload />,
            isActive: true
          },
          {
            id: 'final-image',
            type: 'output',
            title: 'Final Image',
            placeholder: 'Final image will appear here',
            value: '',
            icon: <FiImage />,
            isActive: false
          }
        ];

      case 'Color Extractor':
        return [
          {
            id: 'color-reference',
            type: 'upload',
            title: 'Color Reference',
            placeholder: 'Upload color reference image',
            value: '',
            icon: <FiUpload />,
            isActive: true
          },
          {
            id: 'object-reference',
            type: 'upload',
            title: 'Object Reference',
            placeholder: 'Upload object reference image',
            value: '',
            icon: <FiUpload />,
            isActive: true
          },
          {
            id: 'final-color-image',
            type: 'output',
            title: 'Final Image',
            placeholder: 'Final image will appear here',
            value: '',
            icon: <FiImage />,
            isActive: false
          }
        ];

      case 'Sample Generation':
        return [
          {
            id: 'initial-image',
            type: 'upload',
            title: 'Initial Image',
            placeholder: 'Upload initial image',
            value: '',
            icon: <FiUpload />,
            isActive: true
          },
          {
            id: 'color-input',
            type: 'upload',
            title: 'Color Input',
            placeholder: 'Upload color or enter hex code',
            value: '',
            icon: <MdPalette />,
            isActive: true
          },
          {
            id: 'command-input',
            type: 'prompt',
            title: 'Transformation Command',
            placeholder: 'Enter transformation command (e.g., "Change color to blue")',
            value: '',
            icon: <FiMessageSquare />,
            isActive: true
          },
          {
            id: 'transformed-image',
            type: 'output',
            title: 'Transformed Image',
            placeholder: 'Transformed image will appear here',
            value: '',
            icon: <FiImage />,
            isActive: false
          },
          {
            id: 'prompt-generator',
            type: 'output',
            title: 'Generated Prompt',
            placeholder: 'Detailed prompt will be generated here',
            value: '',
            icon: <FiFileText />,
            isActive: false
          }
        ];

      case 'Image Enhancer':
        return [
          {
            id: 'input-image',
            type: 'upload',
            title: 'Input Image',
            placeholder: 'Upload image to enhance',
            value: '',
            icon: <FiUpload />,
            isActive: true
          },
          {
            id: 'enhancement-prompt',
            type: 'prompt',
            title: 'Enhancement Prompt',
            placeholder: 'Describe how to enhance the image...',
            value: '',
            icon: <FiMessageSquare />,
            isActive: true
          },
          {
            id: 'output-image',
            type: 'output',
            title: 'Enhanced Image',
            placeholder: 'Enhanced image will appear here',
            value: '',
            icon: <FiImage />,
            isActive: false
          }
        ];

             case 'Moodboard Generator':
         return [
           {
             id: 'main-logo',
             type: 'upload',
             title: 'Main Logo',
             placeholder: 'Upload main logo',
             value: '',
             icon: <FiUpload />,
             isActive: true
           },
           {
             id: 'color-palette',
             type: 'upload',
             title: 'Color Palette',
             placeholder: 'Upload color palette',
             value: '',
             icon: <MdPalette />,
             isActive: true
           },
           {
             id: 'font-pairing',
             type: 'upload',
             title: 'Font Pairing',
             placeholder: 'Upload font pairing',
             value: '',
             icon: <FiType />,
             isActive: true
           },
           {
             id: 'design-style',
             type: 'upload',
             title: 'Design Style',
             placeholder: 'Upload design style reference',
             value: '',
             icon: <FiUpload />,
             isActive: true
           },
           {
             id: 'pattern',
             type: 'upload',
             title: 'Pattern',
             placeholder: 'Upload pattern',
             value: '',
             icon: <FiGrid />,
             isActive: true
           },
           {
             id: 'textures',
             type: 'upload',
             title: 'Textures',
             placeholder: 'Upload textures',
             value: '',
             icon: <FiLayers />,
             isActive: true
           },
           {
             id: 'product-mockups',
             type: 'upload',
             title: 'Product Mockups',
             placeholder: 'Upload product mockups',
             value: '',
             icon: <FiBox />,
             isActive: true
           },
           {
             id: 'icon-sets',
             type: 'upload',
             title: 'Icon Sets',
             placeholder: 'Upload icon sets',
             value: '',
             icon: <FiGrid />,
             isActive: true
           },
           {
             id: 'final-moodboard',
             type: 'output',
             title: 'Final Moodboard',
             placeholder: 'Final moodboard will appear here',
             value: '',
             icon: <FiImage />,
             isActive: false
           }
         ];

       case 'Asset Generator':
         return [
           {
             id: 'universal-branding',
             type: 'upload',
             title: 'Universal Branding',
             placeholder: 'Extract the Style, color, or the universal branding',
             value: '',
             icon: <FiUpload />,
             isActive: true
           },
           {
             id: 'illustrations',
             type: 'upload',
             title: 'Illustrations, objects or icons',
             placeholder: 'Upload illustrations, objects or icons',
             value: '',
             icon: <FiUpload />,
             isActive: true
           },
           {
             id: 'landing-pages',
             type: 'upload',
             title: 'Landing pages & Mockups',
             placeholder: 'Upload landing pages & mockups',
             value: '',
             icon: <FiUpload />,
             isActive: true
           },
           {
             id: 'hand-sketches',
             type: 'upload',
             title: 'Hand Drawn Sketches',
             placeholder: 'Upload hand drawn sketches',
             value: '',
             icon: <FiUpload />,
             isActive: true
           },
           {
             id: 'final-1',
             type: 'output',
             title: 'Final Image 1',
             placeholder: 'Final image will appear here',
             value: '',
             icon: <FiImage />,
             isActive: false
           },
           {
             id: 'final-2',
             type: 'output',
             title: 'Final Image 2',
             placeholder: 'Final image will appear here',
             value: '',
             icon: <FiImage />,
             isActive: false
           },
           {
             id: 'final-3',
             type: 'output',
             title: 'Final Image 3',
             placeholder: 'Final image will appear here',
             value: '',
             icon: <FiImage />,
             isActive: false
           }
         ];

       default:
         return [];
    }
  };

  const handleBoxValueChange = (boxId: string, value: string) => {
    setCenterBoxes(prev => 
      prev.map(box => 
        box.id === boxId ? { ...box, value } : box
      )
    );
  };

  const handleFileUpload = (boxId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      // Apply AI positioning and styling to uploaded images
      const processedImageUrl = applyAIPositioning(imageUrl);
      handleBoxValueChange(boxId, processedImageUrl);
    };
    reader.readAsDataURL(file);
  };

  const applyAIPositioning = (imageUrl: string): string => {
    // Create a canvas to apply AI-style positioning and styling
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageUrl;

    canvas.width = 300;
    canvas.height = 300;

    // Set background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2a2a2a');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw the image with AI-style positioning
    const img = new Image();
    img.onload = () => {
      // Calculate positioning for minimal, centered layout
      const maxSize = Math.min(canvas.width * 0.8, canvas.height * 0.8);
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;

      // Add subtle shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Draw image with rounded corners
      ctx.save();
      ctx.beginPath();
      const radius = 8;
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + newWidth - radius, y);
      ctx.quadraticCurveTo(x + newWidth, y, x + newWidth, y + radius);
      ctx.lineTo(x + newWidth, y + newHeight - radius);
      ctx.quadraticCurveTo(x + newWidth, y + newHeight, x + newWidth - radius, y + newHeight);
      ctx.lineTo(x + radius, y + newHeight);
      ctx.quadraticCurveTo(x, y + newHeight, x, y + newHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, x, y, newWidth, newHeight);
      ctx.restore();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Add subtle border
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, newWidth, newHeight);
    };

    img.src = imageUrl;
    return canvas.toDataURL('image/png');
  };

  const generateShapePreview = (shapeType: string, label: string): string => {
    // Create a canvas to generate shape preview images
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 200;
    canvas.height = 200;

    // Set background
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set shape properties
    ctx.strokeStyle = '#ff6b6b';
    ctx.fillStyle = 'rgba(255, 107, 107, 0.2)';
    ctx.lineWidth = 3;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 60;

    // Draw different shapes based on type
    switch (shapeType) {
      case 'rectangle':
      case 'rectangleNode':
        ctx.beginPath();
        ctx.rect(centerX - size/2, centerY - size/2, size, size);
        ctx.fill();
        ctx.stroke();
        break;

      case 'circle':
      case 'circleNode':
        ctx.beginPath();
        ctx.arc(centerX, centerY, size/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;

      case 'triangle':
      case 'triangleNode':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size/2);
        ctx.lineTo(centerX - size/2, centerY + size/2);
        ctx.lineTo(centerX + size/2, centerY + size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'hexagon':
      case 'hexagonNode':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = centerX + (size/2) * Math.cos(angle);
          const y = centerY + (size/2) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'text':
      case 'textNode':
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('TEXT', centerX, centerY);
        break;

      case 'image':
      case 'imageUploadNode':
        // Draw image icon
        ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
        ctx.beginPath();
        ctx.moveTo(centerX - size/3, centerY - size/3);
        ctx.lineTo(centerX + size/3, centerY + size/3);
        ctx.moveTo(centerX + size/3, centerY - size/3);
        ctx.lineTo(centerX - size/3, centerY + size/3);
        ctx.stroke();
        break;

      case 'arrow':
      case 'arrowNode':
        ctx.beginPath();
        ctx.moveTo(centerX - size/2, centerY);
        ctx.lineTo(centerX + size/2, centerY);
        ctx.lineTo(centerX + size/3, centerY - size/4);
        ctx.moveTo(centerX + size/2, centerY);
        ctx.lineTo(centerX + size/3, centerY + size/4);
        ctx.stroke();
        break;

      case 'document':
      case 'documentNode':
        ctx.beginPath();
        ctx.rect(centerX - size/2, centerY - size/2, size, size * 1.3);
        ctx.fill();
        ctx.stroke();
        // Add document lines
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const y = centerY - size/3 + i * 8;
          ctx.beginPath();
          ctx.moveTo(centerX - size/3, y);
          ctx.lineTo(centerX + size/3, y);
          ctx.stroke();
        }
        break;

      default:
        // Default rectangle
        ctx.beginPath();
        ctx.rect(centerX - size/2, centerY - size/2, size, size);
        ctx.fill();
        ctx.stroke();
    }

    // Add label
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, centerX, centerY + size/2 + 20);

    return canvas.toDataURL('image/png');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update output box with generated result
      const outputBox = centerBoxes.find(box => box.type === 'output');
      if (outputBox) {
        handleBoxValueChange(outputBox.id, 'Generated result placeholder');
      }
      
      // Add toast notification
      // You can integrate with your existing toast system here
      console.log('Generation completed!');
      
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, boxId: string) => {
    e.preventDefault();
    console.log('Drop event triggered for box:', boxId);
    
    // Handle ReactFlow node data
    const reactFlowData = e.dataTransfer.getData('application/reactflow');
    if (reactFlowData) {
      try {
        const parsedData = JSON.parse(reactFlowData);
        console.log('ReactFlow data:', parsedData);
        handleNodeDrop(parsedData, boxId);
        return; // Exit early if ReactFlow data is handled
      } catch (error) {
        console.error('Failed to parse ReactFlow data:', error);
      }
    }

    // Handle custom data (images, prompts from other boxes)
    const customData = e.dataTransfer.getData('application/custom');
    if (customData) {
      try {
        const parsedData = JSON.parse(customData);
        console.log('Custom data:', parsedData);
        handleCustomDataDrop(parsedData, boxId);
        return; // Exit early if custom data is handled
      } catch (error) {
        console.error('Failed to parse custom data:', error);
      }
    }

    // Handle image files
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      console.log('Files dropped:', files.length);
      handleFileDrop(files, boxId);
      return;
    }

    // Handle text data as fallback
    const textData = e.dataTransfer.getData('text/plain');
    if (textData) {
      console.log('Text data:', textData);
      handleTextDrop(textData, boxId);
    }
  };

  const handleNodeDrop = (nodeData: any, boxId: string) => {
    console.log('Handling node drop:', nodeData, 'for box:', boxId);
    const targetBox = centerBoxes.find(box => box.id === boxId);
    if (!targetBox) {
      console.log('Target box not found');
      return;
    }

    // Handle shape drops - create shape preview images
    if (nodeData.shape || nodeData.type) {
      const shapeType = nodeData.shape || nodeData.type;
      console.log('Shape type:', shapeType);
      
      // Generate shape preview image
      const shapeImageUrl = generateShapePreview(shapeType, nodeData.label);
      
             // Always create shape preview images, regardless of box type
       console.log('Setting shape preview image for:', shapeType);
       handleBoxValueChange(boxId, shapeImageUrl);
       return;
    }

    // Handle other node types
    switch (nodeData.type) {
      case 'imageUpload':
        if (targetBox.type === 'upload') {
          const fileInput = document.getElementById(`file-${boxId}`) as HTMLInputElement;
          if (fileInput) {
            fileInput.click();
          }
        }
        break;
      
      case 'prompt':
        if (targetBox.type === 'prompt') {
          const samplePrompts = {
            'text-prompt': 'A beautiful landscape with mountains and sunset',
            'enhancement-prompt': 'Enhance the image with better lighting and colors',
            'asset-type': 'Generate social media banners and profile pictures'
          };
          const prompt = samplePrompts[boxId as keyof typeof samplePrompts] || 'Enter your prompt here...';
          handleBoxValueChange(boxId, prompt);
        }
        break;
      
      default:
        console.log('Unhandled node type:', nodeData.type);
    }
  };

  const handleFileDrop = (files: File[], boxId: string) => {
    const targetBox = centerBoxes.find(box => box.id === boxId);
    if (!targetBox || targetBox.type !== 'upload') return;

    // Handle multiple files
    if (files.length === 1) {
      // Single file - upload to current box
      handleFileUpload(boxId, files[0]);
    } else {
      // Multiple files - distribute to available upload boxes
      const uploadBoxes = centerBoxes.filter(box => box.type === 'upload' && !box.value);
      files.forEach((file, index) => {
        if (index < uploadBoxes.length) {
          handleFileUpload(uploadBoxes[index].id, file);
        }
      });
    }
  };

  const handleCustomDataDrop = (data: any, boxId: string) => {
    const targetBox = centerBoxes.find(box => box.id === boxId);
    if (!targetBox) return;

    switch (data.type) {
      case 'image':
        // Copy image from another box
        handleBoxValueChange(boxId, data.value);
        break;
      
      case 'prompt':
        // Copy prompt text
        handleBoxValueChange(boxId, data.value);
        break;
      
      case 'shape':
        // Apply shape-specific content
        const shapeContent = {
          'rectangle': 'Rectangular design elements and layouts',
          'circle': 'Circular graphics and rounded elements',
          'triangle': 'Triangular patterns and geometric shapes'
        };
        const content = shapeContent[data.shape as keyof typeof shapeContent];
        if (content) {
          handleBoxValueChange(boxId, content);
        }
        break;
    }
  };

  const handleTextDrop = (text: string, boxId: string) => {
    console.log('Handling text drop:', text, 'for box:', boxId);
    const targetBox = centerBoxes.find(box => box.id === boxId);
    if (!targetBox) return;

    if (targetBox.type === 'prompt') {
      // Apply shape-specific prompts based on text
      const shapePrompts = {
        'Rectangle': 'Create a rectangular design element with clean lines and modern aesthetics',
        'Circle': 'Generate circular graphics, icons, and rounded design elements',
        'Triangle': 'Design triangular geometric patterns and angular compositions',
        'Hexagon': 'Create hexagonal patterns and geometric designs',
        'Text': 'Generate text-based designs and typography elements',
        'Image': 'Create image-based compositions and visual designs',
        'Arrow': 'Design arrow graphics and directional elements',
        'Document': 'Generate document layouts and structured designs'
      };
      
      const shapePrompt = shapePrompts[text as keyof typeof shapePrompts];
      if (shapePrompt) {
        console.log('Applying shape prompt from text:', shapePrompt);
        handleBoxValueChange(boxId, shapePrompt);
      } else {
        // Fallback: use the text as a prompt
        handleBoxValueChange(boxId, text);
      }
    }
  };

  if (!isVisible || !templateType) {
    return null;
  }

  return (
    <div className={styles.centerCanvas}>
      <div className={styles.header}>
        <h2 className={styles.title}>{templateType}</h2>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
      </div>

      <div className={`${styles.boxesContainer} ${templateType === 'Style Transfer' ? styles.styleTransfer : ''} ${templateType === 'Asset Generator' ? styles.assetGenerator : ''} ${templateType === 'Moodboard Generator' ? styles.moodboardGenerator : ''} ${templateType === 'Color Extractor' ? styles.colorExtractor : ''} ${templateType === 'Sample Generation' ? styles.sampleGeneration : ''}`}>
        {centerBoxes.map((box) => {
          let boxClass = `${styles.centerBox} ${box.isActive ? styles.active : ''} ${box.type === 'output' ? styles.output : ''}`;
          if (templateType === 'Style Transfer') {
            if (box.id === 'style-reference') boxClass += ` ${styles.styleBox}`;
            else if (box.id === 'content-image') boxClass += ` ${styles.objectBox}`;
            else if (box.id === 'final-image') boxClass += ` ${styles.finalBox}`;
          }
          if (templateType === 'Asset Generator') {
            if (box.id === 'universal-branding') boxClass += ` ${styles.universalBox}`;
            else if (box.id === 'illustrations') boxClass += ` ${styles.leftBox}`;
            else if (box.id === 'landing-pages') boxClass += ` ${styles.leftBox}`;
            else if (box.id === 'hand-sketches') boxClass += ` ${styles.leftBox}`;
            else if (box.id === 'final-1') boxClass += ` ${styles.rightBox}`;
            else if (box.id === 'final-2') boxClass += ` ${styles.rightBox}`;
            else if (box.id === 'final-3') boxClass += ` ${styles.rightBox}`;
          }
          
          return (
            <div
              key={box.id}
              className={boxClass}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, box.id)}
            >
            <div className={styles.boxHeader}>
              <div className={styles.boxIcon}>
                {box.icon}
              </div>
              <h3 className={styles.boxTitle}>{box.title}</h3>
            </div>

            <div className={styles.boxContent}>
                             {box.type === 'upload' && (
                 <>
                   {box.value && (
                     <div className={styles.uploadThumbnailContainer}>
                       <div className={styles.uploadThumbnail}>
                         <img 
                           src={box.value} 
                           alt="Uploaded" 
                           className={styles.thumbnailImage} 
                         />
                         <button 
                           className={styles.removeThumbnail}
                           onClick={() => handleBoxValueChange(box.id, '')}
                         >
                           ×
                         </button>
                       </div>
                     </div>
                   )}
                   <div className={styles.uploadArea}>
                     <input
                       type="file"
                       id={`file-${box.id}`}
                       accept="image/*"
                       onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           handleFileUpload(box.id, file);
                         }
                       }}
                       className={styles.fileInput}
                     />
                     <label htmlFor={`file-${box.id}`} className={styles.uploadLabel}>
                       <FiUpload className={styles.uploadIcon} />
                       <span>Click to upload or drag image here</span>
                     </label>
                     {(templateType === 'Asset Generator' && (box.id === 'universal-branding' || box.id === 'illustrations' || box.id === 'landing-pages' || box.id === 'hand-sketches')) && (
                       <button
                         className={`${styles.generateButton} ${isGenerating ? styles.generating : ''}`}
                         onClick={handleGenerate}
                         disabled={isGenerating}
                       >
                         {isGenerating ? (
                           <>
                             <div className={styles.spinner}></div>
                             <span>Generating...</span>
                           </>
                         ) : (
                           <>
                             <FiZap className={styles.generateIcon} />
                             <span>Generate</span>
                           </>
                         )}
                       </button>
                     )}
                   </div>
                 </>
               )}

                             {box.type === 'prompt' && (
                 <div className={styles.promptContainer}>
                   <div className={styles.promptContent}>
                     {box.value && box.value.startsWith('data:image') && (
                       // Show small shape preview thumbnail at top
                       <div className={styles.shapeThumbnail}>
                         <img 
                           src={box.value} 
                           alt="Shape preview" 
                           className={styles.thumbnailImage} 
                         />
                         <button 
                           className={styles.removeThumbnail}
                           onClick={() => handleBoxValueChange(box.id, '')}
                         >
                           ×
                         </button>
                       </div>
                     )}
                     <textarea
                       value={box.value && !box.value.startsWith('data:image') ? box.value : ''}
                       onChange={(e) => handleBoxValueChange(box.id, e.target.value)}
                       placeholder={box.placeholder}
                       className={styles.promptInput}
                       rows={3}
                       draggable={!!box.value && !box.value.startsWith('data:image')}
                       onDragStart={(e) => {
                         if (box.value && !box.value.startsWith('data:image')) {
                           e.dataTransfer.setData('application/custom', JSON.stringify({
                             type: 'prompt',
                             value: box.value,
                             sourceBox: box.id
                           }));
                         }
                       }}
                     />
                   </div>
                   {box.value && !box.value.startsWith('data:image') && (
                     <div className={styles.dragIndicator}>Drag to copy prompt</div>
                   )}
                 </div>
               )}

              {box.type === 'output' && (
                <div className={styles.outputArea}>
                  {box.value ? (
                    <img src={box.value} alt="Generated" className={styles.outputImage} />
                  ) : (
                    <div className={styles.outputPlaceholder}>
                      <FiImage className={styles.outputIcon} />
                      <span>{box.placeholder}</span>
                    </div>
                  )}
                  {(templateType === 'Moodboard Generator' && box.id === 'final-moodboard') && (
                    <button
                      className={`${styles.generateButton} ${isGenerating ? styles.generating : ''}`}
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className={styles.spinner}></div>
                          <span>Generating Moodboard...</span>
                        </>
                      ) : (
                        <>
                          <FiZap className={styles.generateIcon} />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default CenterCanvas;
