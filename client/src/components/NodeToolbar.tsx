import React, { useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './NodeToolbar.module.css';
import TemplateDropdown from './TemplateDropdown';
import { 
  FiUpload, 
  FiMessageSquare, 
  FiImage, 
  FiDroplet, 
  FiClipboard, 
  FiPackage, 
  FiZap,
  FiMove,
  FiSquare,
  FiCircle,
  FiTriangle,
  FiHexagon,
  FiOctagon,
  FiArrowRight,
  FiArrowLeft,
  FiArrowUp,
  FiArrowDown,
  FiArrowUpRight,
  FiMessageSquare as FiMessage,
  FiImage as FiImageIcon,
  FiFileText,
  FiDatabase,
  FiCpu,
  FiStar,
  FiShield,
  FiHelpCircle,
  FiSettings,
  FiLayers,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiGrid,
  FiEye,
  FiMaximize2,
  FiCopy,
  FiScissors,
  FiClipboard as FiPaste,
  FiRotateCcw,
  FiRotateCw,
  FiSearch,
  FiEdit,
  FiZoomIn,
  FiZoomOut,
  FiFile,
  FiSave,
  FiFolder,
  FiDownload,
  FiPrinter,
  FiInfo,
  FiBook,
  FiGithub,
  FiShare,
  FiCloud,
  FiUser,
  FiMinus,
  FiList
} from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';
import GenerationSidebar from './GenerationSidebar';

interface NodeToolbarProps {
  onTemplateChange: (template: string | null) => void;
  onFreeTemplatesOpen: () => void;
  onWorkflowSelect?: (workflowType: string) => void;
  onCenterCanvasOpen?: (templateType: string) => void;
}

const NodeToolbar: React.FC<NodeToolbarProps> = ({ onTemplateChange, onFreeTemplatesOpen, onWorkflowSelect, onCenterCanvasOpen }) => {
  const { setNodes, setEdges } = useWorkflowStore();
  const [activeTemplate, setActiveTemplate] = React.useState<string | null>(null);
  const [isGenerationMode, setIsGenerationMode] = React.useState(false);
  const [generationTemplateType, setGenerationTemplateType] = React.useState('');

  const handleGenerateClick = (templateType: string) => {
    setGenerationTemplateType(templateType);
    setIsGenerationMode(true);
  };

  const handleBackToTemplates = () => {
    setIsGenerationMode(false);
    setGenerationTemplateType('');
  };

  // n8n-style node templates with red and black color scheme
  const nodeTemplates = {
    'Input & Data': [
      {
        type: 'imageUploadNode',
        label: 'Image Upload',
        icon: <FiUpload />,
        description: 'Upload images for processing',
        color: '#ff6b6b'
      },
      {
        type: 'promptNode',
        label: 'Text Prompt',
        icon: <FiMessageSquare />,
        description: 'Enter text prompts for AI generation',
        color: '#e74c3c'
      }
    ],
    'AI Processing': [
      {
        type: 'styleExtractorNode',
        label: 'Style Extractor',
        icon: <MdPalette />,
        description: 'Extract and apply artistic styles',
        color: '#c0392b'
      },
      {
        type: 'colorExtractorNode',
        label: 'Color Extractor',
        icon: <FiDroplet />,
        description: 'Extract and apply color palettes',
        color: '#a93226'
      }
    ],
    'Advanced AI': [
      {
        type: 'assetGeneratorNode',
        label: 'Asset Generator',
        icon: <FiPackage />,
        description: 'Generate branded assets from source materials',
        color: '#7b241c'
      },
      {
        type: 'moodboardExtractorNode',
        label: 'Moodboard Generator',
        icon: <FiClipboard />,
        description: 'Create comprehensive design moodboards',
        color: '#922b21'
      }
    ],
    'Output': [
      {
        type: 'imageOutputNode',
        label: 'Image Output',
        icon: <FiImage />,
        description: 'Display generated images and results',
        color: '#641e16'
      }
    ]
  };



  const handleDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    const dragData = {
      type: nodeType,
      label: label,
      shape: nodeType
    };
    
    // Set ReactFlow data for canvas compatibility
    event.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
    
    // Set custom data for center canvas
    event.dataTransfer.setData('application/custom', JSON.stringify({
      type: 'shape',
      shape: nodeType,
      label: label
    }));
    
    // Set text data as fallback
    event.dataTransfer.setData('text/plain', label);
    
    event.dataTransfer.effectAllowed = 'copy';
  };

  const clearActiveTemplate = () => {
    setActiveTemplate(null);
    onTemplateChange(null);
  };

  const getCategoryForTemplate = (template: string): string => {
    switch (template) {
      case 'Basic Generation':
      case 'Sample Generation':
        return 'Input & Data';
      case 'Style Transfer':
      case 'Color Extraction':
        return 'AI Processing';
      case 'Moodboard Generator':
      case 'Asset Generator':
        return 'Advanced AI';
      default:
        return '';
    }
  };

  const loadBasicTemplate = () => {
    setActiveTemplate('Basic Generation');
    onTemplateChange('Basic Generation');
    
    // Trigger workflow selection in canvas
    if (onWorkflowSelect) {
      onWorkflowSelect('basicGeneration');
    }
    
    // Clear existing nodes and edges
    setNodes([]);
    setEdges([]);
  };

  const loadStyleTransferTemplate = () => {
    setActiveTemplate('Style Transfer');
    onTemplateChange('Style Transfer');
    
    const nodes = [
      {
        id: 'style-reference',
        type: 'imageUploadNode',
        position: { x: 1200, y: 100 },
        data: { label: 'Reference Image (For Styles)' }
      },
      {
        id: 'object-reference',
        type: 'imageUploadNode',
        position: { x: 1200, y: 200 },
        data: { label: 'Reference Image (For Object)' }
      }
    ];

    setNodes(nodes);
    setEdges([]);
  };

  const loadSampleGenerationTemplate = () => {
    setActiveTemplate('Sample Generation');
    onTemplateChange('Sample Generation');
    
    const nodes = [
      {
        id: 'prompt-1',
        type: 'promptNode',
        position: { x: 1200, y: 100 },
        data: { 
          label: 'Text Prompt', 
          prompt: 'A cute cat sitting in a garden with colorful flowers',
          isGenerating: false,
          showSamples: false
        }
      }
    ];

    setNodes(nodes);
    setEdges([]);
  };

  const loadColorExtractionTemplate = () => {
    setActiveTemplate('Color Extraction');
    onTemplateChange('Color Extraction');
    
    const nodes = [
      {
        id: 'color-reference',
        type: 'imageUploadNode',
        position: { x: 1200, y: 100 },
        data: { 
          label: 'Reference Image (For Color)',
          imageUrl: null
        }
      },
      {
        id: 'object-reference',
        type: 'imageUploadNode',
        position: { x: 1200, y: 200 },
        data: { 
          label: 'Reference Image (For Object)',
          imageUrl: null
        }
      },
      {
        id: 'color-extractor',
        type: 'colorExtractorNode',
        position: { x: 1200, y: 300 },
        data: { 
          label: 'Color Extractor',
          colorImageUrl: null,
          objectImageUrl: null,
          isExtracting: false,
          extractedColors: null,
          colorMapping: null,
          error: null
        }
      }
    ];

    const edges = [
      {
        id: 'edge-1',
        source: 'color-reference',
        target: 'color-extractor',
        type: 'default',
        style: { stroke: '#ffffff', strokeWidth: 2 },
        animated: false
      },
      {
        id: 'edge-2',
        source: 'object-reference',
        target: 'color-extractor',
        type: 'default',
        style: { stroke: '#ffffff', strokeWidth: 2 },
        animated: false
      },
      {
        id: 'edge-3',
        source: 'color-extractor',
        target: 'final-image',
        type: 'default',
        style: { stroke: '#ffffff', strokeWidth: 2 },
        animated: false
      }
    ];

    setNodes(nodes);
    setEdges(edges);
  };

  const loadMoodboardTemplate = () => {
    setActiveTemplate('Moodboard Generator');
    onTemplateChange('Moodboard Generator');
    
    const nodes = [
      // Top row upload nodes - 2x4 grid layout
      {
        id: 'main-logo',
        type: 'imageUploadNode',
        position: { x: 1200, y: 100 },
        data: { label: 'Main Logo' }
      },
      {
        id: 'color-palette',
        type: 'imageUploadNode',
        position: { x: 1200, y: 200 },
        data: { label: 'Color Palette' }
      },
      {
        id: 'font-pairing',
        type: 'imageUploadNode',
        position: { x: 1200, y: 300 },
        data: { label: 'Font Pairing' }
      },
      {
        id: 'design-style',
        type: 'imageUploadNode',
        position: { x: 1200, y: 400 },
        data: { label: 'Design Style' }
      },
      // Bottom row upload nodes
      {
        id: 'pattern',
        type: 'imageUploadNode',
        position: { x: 1200, y: 500 },
        data: { label: 'Pattern' }
      },
      {
        id: 'textures',
        type: 'imageUploadNode',
        position: { x: 1200, y: 600 },
        data: { label: 'Textures' }
      },
      {
        id: 'product-mockups',
        type: 'imageUploadNode',
        position: { x: 1200, y: 700 },
        data: { label: 'Product Mockups' }
      },
      {
        id: 'icon-sets',
        type: 'imageUploadNode',
        position: { x: 1200, y: 800 },
        data: { label: 'Icon Sets' }
      }
    ];

    const edges = [
      // Connect all upload nodes to final moodboard with smooth curved lines
      { 
        id: 'edge-1', 
        source: 'main-logo', 
        target: 'final-moodboard', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-2', 
        source: 'color-palette', 
        target: 'final-moodboard', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-3', 
        source: 'font-pairing', 
        target: 'final-moodboard', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-4', 
        source: 'design-style', 
        target: 'final-moodboard', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-5', 
        source: 'pattern', 
        target: 'final-moodboard', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-6', 
        source: 'textures', 
        target: 'final-moodboard', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-7', 
        source: 'product-mockups', 
        target: 'final-moodboard', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-8', 
        source: 'icon-sets', 
        target: 'final-moodboard', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      }
    ];

    setNodes(nodes);
    setEdges(edges);
  };

  const loadAssetGenerationTemplate = () => {
    setActiveTemplate('Asset Generator');
    onTemplateChange('Asset Generator');
    
    // Trigger workflow selection in canvas
    if (onWorkflowSelect) {
      onWorkflowSelect('assetGenerator');
    }
    
    const nodes = [
      // Main branding source at top center
      {
        id: 'branding-source',
        type: 'imageUploadNode',
        position: { x: 1200, y: 100 },
        data: { label: 'Branding Source' }
      },
      // Secondary upload nodes - left column with more spacing
      {
        id: 'illustrations-upload',
        type: 'imageUploadNode',
        position: { x: 1200, y: 200 },
        data: { label: 'Illustrations, objects or icons' }
      },
      {
        id: 'landing-pages-upload',
        type: 'imageUploadNode',
        position: { x: 1200, y: 300 },
        data: { label: 'Landing pages & Mockups' }
      },
      {
        id: 'sketches-upload',
        type: 'imageUploadNode',
        position: { x: 1200, y: 400 },
        data: { label: 'Hand Drawn Sketches' }
      }
    ];

    const edges = [
      // Connect branding source to all secondary uploads with curved paths
      { 
        id: 'edge-1', 
        source: 'branding-source', 
        target: 'illustrations-upload', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-2', 
        source: 'branding-source', 
        target: 'landing-pages-upload', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      { 
        id: 'edge-3', 
        source: 'branding-source', 
        target: 'sketches-upload', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2 }, 
        animated: false 
      },
      // Connect secondary uploads to their respective final images with dashed lines
      { 
        id: 'edge-4', 
        source: 'illustrations-upload', 
        target: 'final-image-1', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2, strokeDasharray: '8,4' }, 
        animated: false 
      },
      { 
        id: 'edge-5', 
        source: 'landing-pages-upload', 
        target: 'final-image-2', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2, strokeDasharray: '8,4' }, 
        animated: false 
      },
      { 
        id: 'edge-6', 
        source: 'sketches-upload', 
        target: 'final-image-3', 
        type: 'smoothstep', 
        style: { stroke: '#ffffff', strokeWidth: 2, strokeDasharray: '8,4' }, 
        animated: false 
      }
    ];

    setNodes(nodes);
    setEdges(edges);
  };

  // Template dropdown configurations
  const basicGenerationItems = [
    { 
      icon: <FiSquare />, 
      label: 'Rectangle', 
      action: () => console.log('Add rectangle'),
      nodeType: 'rectangleNode',
      data: { width: 100, height: 60, strokeWidth: 2 }
    },
    { 
      icon: <FiCircle />, 
      label: 'Circle', 
      action: () => console.log('Add circle'),
      nodeType: 'circleNode',
      data: { radius: 50, strokeWidth: 2 }
    },
    { 
      icon: <FiTriangle />, 
      label: 'Triangle', 
      action: () => console.log('Add triangle'),
      nodeType: 'triangleNode',
      data: { width: 80, height: 80, strokeWidth: 2 }
    },
    { 
      icon: <FiHexagon />, 
      label: 'Hexagon', 
      action: () => console.log('Add hexagon'),
      nodeType: 'hexagonNode',
      data: { width: 90, height: 90, strokeWidth: 2 }
    },
    { 
      icon: <FiMessage />, 
      label: 'Text', 
      action: () => console.log('Add text'),
      nodeType: 'textNode',
      data: { text: 'Double click to edit', fontSize: 16, fontColor: '#ffffff', fontFamily: 'Arial', fontWeight: 'normal' }
    },
    { 
      icon: <FiImage />, 
      label: 'Image', 
      action: () => console.log('Add image'),
      nodeType: 'imageUploadNode',
      data: { label: 'Image Upload' }
    },
    { 
      icon: <FiArrowRight />, 
      label: 'Arrow', 
      action: () => console.log('Add arrow'),
      nodeType: 'arrowNode',
      data: { width: 120, height: 20, strokeWidth: 2 }
    },
    { 
      icon: <FiFileText />, 
      label: 'Document', 
      action: () => console.log('Add document'),
      nodeType: 'documentNode',
      data: { text: 'Document', fontSize: 14, fontColor: '#ffffff', fontFamily: 'Arial', fontWeight: 'bold' }
    },
  ];

  const styleTransferItems = [
    { icon: <MdPalette />, label: 'Palette', action: () => console.log('Color palette') },
    { icon: <FiDroplet />, label: 'Color', action: () => console.log('Color picker') },
    { icon: <FiStar />, label: 'Style', action: () => console.log('Style tool') },
    { icon: <FiImage />, label: 'Filter', action: () => console.log('Image filter') },
    { icon: <FiEdit />, label: 'Brush', action: () => console.log('Brush tool') },
    { icon: <FiEye />, label: 'Preview', action: () => console.log('Preview style') },
    { icon: <FiSettings />, label: 'Settings', action: () => console.log('Style settings') },
    { icon: <FiSave />, label: 'Save', action: () => console.log('Save style') },
  ];

  const sampleGenerationItems = [
    { icon: <FiImage />, label: 'Sample', action: () => console.log('Load sample') },
    { icon: <FiFile />, label: 'Template', action: () => console.log('Use template') },
    { icon: <FiCopy />, label: 'Copy', action: () => console.log('Copy sample') },
    { icon: <FiEdit />, label: 'Edit', action: () => console.log('Edit sample') },
    { icon: <FiSearch />, label: 'Search', action: () => console.log('Search samples') },
    { icon: <FiDownload />, label: 'Download', action: () => console.log('Download sample') },
    { icon: <FiShare />, label: 'Share', action: () => console.log('Share sample') },
    { icon: <FiStar />, label: 'Favorite', action: () => console.log('Add to favorites') },
  ];

  const colorExtractionItems = [
    { icon: <FiDroplet />, label: 'Extract', action: () => console.log('Extract colors') },
    { icon: <MdPalette />, label: 'Palette', action: () => console.log('Color palette') },
    { icon: <FiCopy />, label: 'Copy', action: () => console.log('Copy color') },
    { icon: <FiSave />, label: 'Save', action: () => console.log('Save palette') },
    { icon: <FiEye />, label: 'Preview', action: () => console.log('Preview colors') },
    { icon: <FiSettings />, label: 'Settings', action: () => console.log('Color settings') },
    { icon: <FiDownload />, label: 'Export', action: () => console.log('Export palette') },
    { icon: <FiShare />, label: 'Share', action: () => console.log('Share palette') },
  ];

  const moodboardItems = [
    { icon: <FiClipboard />, label: 'Board', action: () => console.log('Create board') },
    { icon: <FiImage />, label: 'Images', action: () => console.log('Add images') },
    { icon: <FiLayers />, label: 'Layers', action: () => console.log('Manage layers') },
    { icon: <FiGrid />, label: 'Grid', action: () => console.log('Grid layout') },
    { icon: <FiMove />, label: 'Arrange', action: () => console.log('Arrange items') },
    { icon: <FiSave />, label: 'Save', action: () => console.log('Save moodboard') },
    { icon: <FiDownload />, label: 'Export', action: () => console.log('Export moodboard') },
    { icon: <FiShare />, label: 'Share', action: () => console.log('Share moodboard') },
  ];

  const assetGeneratorItems = [
    { icon: <FiPackage />, label: 'Assets', action: () => console.log('Generate assets') },
    { icon: <FiImage />, label: 'Images', action: () => console.log('Create images') },
    { icon: <FiFileText />, label: 'Documents', action: () => console.log('Create documents') },
    { icon: <FiDatabase />, label: 'Data', action: () => console.log('Process data') },
    { icon: <FiCpu />, label: 'AI', action: () => console.log('AI processing') },
    { icon: <FiSettings />, label: 'Settings', action: () => console.log('Generator settings') },
    { icon: <FiDownload />, label: 'Export', action: () => console.log('Export assets') },
    { icon: <FiShare />, label: 'Share', action: () => console.log('Share assets') },
  ];

  return (
    <div className={styles.sidebar}>
      {isGenerationMode ? (
        <GenerationSidebar
          isOpen={true}
          onClose={handleBackToTemplates}
          templateType={generationTemplateType}
        />
      ) : (
        <>
          {/* Quick Templates */}
          <div className={styles.templatesSection}>
        <h3 className={styles.sectionTitle}>Quick Templates</h3>
        <div className={styles.templateButtons}>
          <TemplateDropdown
            label="Basic Generation"
            description="Simple text-to-image workflow"
            icon={<FiZap />}
            items={basicGenerationItems}
            onTemplateLoad={loadBasicTemplate}
            onGenerateClick={handleGenerateClick}
            onCenterCanvasClick={() => onCenterCanvasOpen?.('Text-to-Image')}
          />
          
          <TemplateDropdown
            label="Style Transfer"
            description="Apply artistic styles to images"
            icon={<MdPalette />}
            items={styleTransferItems}
            onTemplateLoad={loadStyleTransferTemplate}
            onGenerateClick={handleGenerateClick}
            onCenterCanvasClick={() => onCenterCanvasOpen?.('Style Transfer')}
          />
          
          <TemplateDropdown
            label="Sample Generation"
            description="Try sample prompts with mock images"
            icon={<FiImage />}
            items={sampleGenerationItems}
            onTemplateLoad={loadSampleGenerationTemplate}
            onGenerateClick={handleGenerateClick}
            onCenterCanvasClick={() => onCenterCanvasOpen?.('Sample Generation')}
          />
          
          <TemplateDropdown
            label="Color Extraction"
            description="Extract and map color palettes"
            icon={<FiDroplet />}
            items={colorExtractionItems}
            onTemplateLoad={loadColorExtractionTemplate}
            onGenerateClick={handleGenerateClick}
            onCenterCanvasClick={() => onCenterCanvasOpen?.('Color Extractor')}
          />
          
          <TemplateDropdown
            label="Moodboard Generator"
            description="Create comprehensive design moodboards"
            icon={<FiClipboard />}
            items={moodboardItems}
            onTemplateLoad={loadMoodboardTemplate}
            onGenerateClick={handleGenerateClick}
            onCenterCanvasClick={() => onCenterCanvasOpen?.('Moodboard Generator')}
          />
          
          <TemplateDropdown
            label="Asset Generator"
            description="Generate branded assets from source materials"
            icon={<FiPackage />}
            items={assetGeneratorItems}
            onTemplateLoad={loadAssetGenerationTemplate}
            onGenerateClick={handleGenerateClick}
            onCenterCanvasClick={() => onCenterCanvasOpen?.('Asset Generator')}
          />
          
          <button 
            className={styles.templateBtn}
            onClick={onFreeTemplatesOpen}
          >
            <span className={styles.templateIcon}>
              <FiZap />
            </span>
            <div className={styles.templateInfo}>
              <span className={styles.templateName}>Free Templates</span>
              <span className={styles.templateDesc}>Access free workflow templates</span>
            </div>
          </button>
        </div>
      </div>



      {/* Draggable Nodes */}
      <div className={styles.nodesSection}>
        <h3 className={styles.sectionTitle}>Design Elements</h3>
        <div className={styles.nodeButtons}>
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'rectangleNode', 
                label: 'Rectangle',
                data: { width: 100, height: 60, strokeWidth: 2 }
              }));
            }}
          >
            <FiSquare />
            <span>Rectangle</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'circleNode', 
                label: 'Circle',
                data: { radius: 50, strokeWidth: 2 }
              }));
            }}
          >
            <FiCircle />
            <span>Circle</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'textNode', 
                label: 'Text',
                data: { text: 'Double click to edit', fontSize: 16, fontColor: '#ffffff', fontFamily: 'Arial', fontWeight: 'normal' }
              }));
            }}
          >
            <FiFileText />
            <span>Text</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'rectangleNode', 
                label: 'Arrow',
                data: { width: 120, height: 20, strokeWidth: 2 }
              }));
            }}
          >
            <FiArrowRight />
            <span>Arrow</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'rectangleNode', 
                label: 'Triangle',
                data: { width: 80, height: 80, strokeWidth: 2 }
              }));
            }}
          >
            <FiTriangle />
            <span>Triangle</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'rectangleNode', 
                label: 'Hexagon',
                data: { width: 90, height: 90, strokeWidth: 2 }
              }));
            }}
          >
            <FiHexagon />
            <span>Hexagon</span>
          </button>

          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'imageUploadNode', 
                label: 'Image Upload'
              }));
            }}
          >
            <FiUpload />
            <span>Image Upload</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'promptNode', 
                label: 'Text Prompt'
              }));
            }}
          >
            <FiMessageSquare />
            <span>Text Prompt</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'imageOutputNode', 
                label: 'Image Output'
              }));
            }}
          >
            <FiImage />
            <span>Image Output</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'styleExtractorNode', 
                label: 'Style Extractor'
              }));
            }}
          >
            <MdPalette />
            <span>Style Extractor</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'colorExtractorNode', 
                label: 'Color Extractor'
              }));
            }}
          >
            <FiDroplet />
            <span>Color Extractor</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'moodboardExtractorNode', 
                label: 'Moodboard Extractor'
              }));
            }}
          >
            <FiClipboard />
            <span>Moodboard</span>
          </button>
          
          <button 
            className={styles.nodeBtn}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
                type: 'assetGeneratorNode', 
                label: 'Asset Generator'
              }));
            }}
          >
            <FiPackage />
            <span>Asset Generator</span>
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default NodeToolbar;
