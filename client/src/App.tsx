
import './App.css';
import BulbitCanvas from './components/BulbitCanvas';
import NodeToolbar from './components/NodeToolbar';
import EditingToolbar from './components/EditingToolbar';
import MenuDropdown from './components/MenuDropdown';
import ExecutionButton from './components/ExecutionButton';
import HomePage from './components/HomePage';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import NodeSearch from './components/NodeSearch';
import FreeTemplatesModal from './components/FreeTemplatesModal';
import Toast from './components/Toast';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import ErrorBoundary from './components/ErrorBoundary';
import CenterCanvas from './components/CenterCanvas';
import { useWorkflowStore } from './store/workflowStore';
import { useState } from 'react';
import { 
  FiSave, 
  FiUpload, 
  FiRotateCcw, 
  FiRotateCw, 
  FiSearch,
  FiMessageSquare, 
  FiImage, 
  FiDroplet, 
  FiClipboard, 
  FiPackage, 
  FiMove,
  FiFile,
  FiFolder,
  FiDownload,
  FiPrinter,
  FiCopy,
  FiScissors,
  FiEdit,
  FiZoomIn,
  FiZoomOut,
  FiGrid,
  FiEye,
  FiMaximize2,
  FiLayers,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiStar,
  FiShield,
  FiHelpCircle,
  FiInfo,
  FiBook,
  FiGithub,
  FiSettings,
  FiSquare,
  FiArrowRight,
  FiArrowLeft,
  FiArrowUp,
  FiArrowDown,
  FiFileText,
  FiDatabase,
  FiCpu,
  FiShare
} from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';

function App() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFreeTemplatesOpen, setIsFreeTemplatesOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{id: string; type: 'success' | 'error' | 'info'; message: string}>>([]);
  const [centerCanvasVisible, setCenterCanvasVisible] = useState(false);
  const [centerCanvasTemplate, setCenterCanvasTemplate] = useState<string | null>(null);
  
  const handleGetStarted = () => {
    setShowDashboard(true);
    // Load saved workflow when entering dashboard
    useWorkflowStore.getState().loadWorkflow();
  };

  const handleCenterCanvasOpen = (templateType: string) => {
    setCenterCanvasTemplate(templateType);
    setCenterCanvasVisible(true);
  };

  const handleCenterCanvasClose = () => {
    setCenterCanvasVisible(false);
    setCenterCanvasTemplate(null);
  };

  const handleWorkflowSelect = (workflowType: string) => {
    setActiveWorkflow(workflowType);
  };

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const handleSave = () => {
    try {
      useWorkflowStore.getState().autoSave();
      addToast('success', 'Workflow saved successfully!');
    } catch (error) {
      addToast('error', 'Failed to save workflow');
    }
  };

  const handleExport = () => {
    try {
      const { nodes, edges } = useWorkflowStore.getState();
      const workflowData = { nodes, edges, timestamp: Date.now() };
      const dataStr = JSON.stringify(workflowData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bulbit-workflow-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast('success', 'Workflow exported successfully!');
    } catch (error) {
      addToast('error', 'Failed to export workflow');
    }
  };

  const handleShare = () => {
    try {
      const { nodes, edges } = useWorkflowStore.getState();
      const workflowData = { nodes, edges, timestamp: Date.now() };
      const dataStr = JSON.stringify(workflowData, null, 2);
      
      if (navigator.share) {
        navigator.share({
          title: 'Bulbit AI Workflow',
          text: 'Check out this AI workflow I created!',
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(dataStr);
        addToast('success', 'Workflow copied to clipboard!');
      }
    } catch (error) {
      addToast('error', 'Failed to share workflow');
    }
  };

  // Menu dropdown configurations
  const fileMenuItems = [
    { icon: <FiFile />, label: 'New', action: () => addToast('info', 'New file') },
    { icon: <FiFolder />, label: 'Open', action: () => addToast('info', 'Open file') },
    { icon: <FiSave />, label: 'Save', action: handleSave },
    { icon: <FiDownload />, label: 'Export', action: handleExport },
    { icon: <FiPrinter />, label: 'Print', action: () => addToast('info', 'Print workflow') },
    { icon: <FiSettings />, label: 'Settings', action: () => addToast('info', 'Open settings') },
  ];

  const editMenuItems = [
    { icon: <FiCopy />, label: 'Copy', action: () => addToast('info', 'Copy selected') },
    { icon: <FiScissors />, label: 'Cut', action: () => addToast('info', 'Cut selected') },
    { icon: <FiClipboard />, label: 'Paste', action: () => addToast('info', 'Paste') },
    { icon: <FiRotateCcw />, label: 'Undo', action: () => addToast('info', 'Undo') },
    { icon: <FiRotateCw />, label: 'Redo', action: () => addToast('info', 'Redo') },
    { icon: <FiSearch />, label: 'Find', action: () => addToast('info', 'Find') },
    { icon: <FiEdit />, label: 'Edit', action: () => addToast('info', 'Edit mode') },
    { icon: <FiSquare />, label: 'Select', action: () => addToast('info', 'Select tool') },
  ];

  const viewMenuItems = [
    { icon: <FiZoomIn />, label: 'Zoom In', action: () => addToast('info', 'Zoom in') },
    { icon: <FiZoomOut />, label: 'Zoom Out', action: () => addToast('info', 'Zoom out') },
    { icon: <FiEye />, label: 'Fit Screen', action: () => addToast('info', 'Fit to screen') },
    { icon: <FiGrid />, label: 'Grid', action: () => addToast('info', 'Toggle grid') },
    { icon: <FiMaximize2 />, label: 'Full Screen', action: () => addToast('info', 'Full screen') },
    { icon: <FiSettings />, label: 'View Options', action: () => addToast('info', 'View options') },
  ];

  const arrangeMenuItems = [
    { icon: <FiLayers />, label: 'Group', action: () => addToast('info', 'Group selected') },
    { icon: <FiMove />, label: 'Ungroup', action: () => addToast('info', 'Ungroup selected') },
    { icon: <FiAlignLeft />, label: 'Align Left', action: () => addToast('info', 'Align left') },
    { icon: <FiAlignCenter />, label: 'Align Center', action: () => addToast('info', 'Align center') },
    { icon: <FiAlignRight />, label: 'Align Right', action: () => addToast('info', 'Align right') },
    { icon: <FiArrowUp />, label: 'Bring Front', action: () => addToast('info', 'Bring to front') },
    { icon: <FiArrowDown />, label: 'Send Back', action: () => addToast('info', 'Send to back') },
    { icon: <FiGrid />, label: 'Distribute', action: () => addToast('info', 'Distribute evenly') },
  ];

  const extrasMenuItems = [
    { icon: <FiStar />, label: 'Advanced', action: () => addToast('info', 'Advanced tools') },
    { icon: <FiShield />, label: 'Security', action: () => addToast('info', 'Security settings') },
    { icon: <FiDatabase />, label: 'Database', action: () => addToast('info', 'Database tools') },
    { icon: <FiCpu />, label: 'System', action: () => addToast('info', 'System tools') },
    { icon: <FiMessageSquare />, label: 'Chat', action: () => addToast('info', 'Open chat') },
    { icon: <FiImage />, label: 'Gallery', action: () => addToast('info', 'Image gallery') },
    { icon: <FiFileText />, label: 'Documents', action: () => addToast('info', 'Document tools') },
    { icon: <FiSettings />, label: 'Tools', action: () => addToast('info', 'Extra tools') },
  ];

  const helpMenuItems = [
    { icon: <FiHelpCircle />, label: 'Help', action: () => addToast('info', 'Open help') },
    { icon: <FiInfo />, label: 'About', action: () => addToast('info', 'About Bulbit AI') },
    { icon: <FiBook />, label: 'Tutorial', action: () => addToast('info', 'Start tutorial') },
    { icon: <FiSettings />, label: 'Preferences', action: () => addToast('info', 'Preferences') },
    { icon: <FiGithub />, label: 'GitHub', action: () => addToast('info', 'Visit GitHub') },
    { icon: <FiMessageSquare />, label: 'Support', action: () => addToast('info', 'Contact support') },
  ];

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleNodeSelect = (nodeType: string, label: string) => {
    try {
      const { setNodes } = useWorkflowStore.getState();
      const { nodes } = useWorkflowStore.getState();
      
      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        data: { label }
      };
      
      setNodes([...nodes, newNode]);
      addToast('success', `${label} node added to canvas`);
      setIsSearchOpen(false);
    } catch (error) {
      addToast('error', 'Failed to add node to canvas');
    }
  };

  // Node templates for search functionality
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

  // Show home page if dashboard is not active
  if (!showDashboard) {
    return (
      <ErrorBoundary>
        <HomePage onGetStarted={handleGetStarted} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
    <div className="app">
      {/* Unified Navigation Bar */}
      <header className="app-header">
        {/* Top Row - Header */}
        <div className="header-top">
          <div className="header-left">
            <div className="logo">
              <img 
                src="/Icon black.png" 
                alt="Bulbit AI Logo" 
                className="logo-image"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <h1 className="app-title">Bulbit AI Workflow Builder</h1>
            <div className="menu-bar">
              <MenuDropdown label="File" items={fileMenuItems} />
              <MenuDropdown label="Edit" items={editMenuItems} />
              <MenuDropdown label="View" items={viewMenuItems} />
              <MenuDropdown label="Arrange" items={arrangeMenuItems} />
              <MenuDropdown label="Extras" items={extrasMenuItems} />
              <MenuDropdown label="Help" items={helpMenuItems} />
            </div>
          </div>
          <div className="header-right">
            <button className="share-btn">
              <FiShare />
              <span>Share</span>
            </button>
          </div>
        </div>
        
        {/* Bottom Row - Toolbar */}
        <div className="header-toolbar">
          <EditingToolbar
            onSave={handleSave}
            onExport={handleExport}
            onSearch={handleSearch}
            onShare={handleShare}
            onHome={() => setShowDashboard(false)}
            onShortcuts={() => setIsShortcutsHelpOpen(true)}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="app-main">
        {/* Left Sidebar */}
        <aside className="app-sidebar">
          <NodeToolbar 
            onTemplateChange={setActiveTemplate} 
            onFreeTemplatesOpen={() => setIsFreeTemplatesOpen(true)}
            onWorkflowSelect={handleWorkflowSelect}
            onCenterCanvasOpen={handleCenterCanvasOpen}
          />
        </aside>

        {/* Canvas Area */}
        <main className="app-canvas">
          <BulbitCanvas activeWorkflow={activeWorkflow} />
          
          {/* Center Canvas Overlay */}
          <CenterCanvas
            isVisible={centerCanvasVisible}
            templateType={centerCanvasTemplate}
            onClose={handleCenterCanvasClose}
          />
        </main>


      </div>
      
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onSave={handleSave}
        onExport={handleExport}
        onSearch={handleSearch}
      />
      
      {/* Node Search Modal */}
      <NodeSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNodeSelect={handleNodeSelect}
        nodeTemplates={nodeTemplates}
      />
      
      {/* Free Templates Modal */}
      <FreeTemplatesModal 
        isOpen={isFreeTemplatesOpen}
        onClose={() => setIsFreeTemplatesOpen(false)}
        onTemplateUse={addToast}
      />
      
      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
      
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default App;
