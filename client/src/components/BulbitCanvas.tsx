import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  Connection,
  Edge,
  Node,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/workflowStore';
import ImageUploadNode from '../nodes/ImageUploadNode';
import PromptNode from '../nodes/PromptNode';
import ImageOutputNode from '../nodes/ImageOutputNode';
import StyleExtractorNode from '../nodes/StyleExtractorNode';
import ColorExtractorNode from '../nodes/ColorExtractorNode';
import MoodboardExtractorNode from '../nodes/MoodboardExtractorNode';
import AssetGeneratorNode from '../nodes/AssetGeneratorNode';
import RectangleNode from '../nodes/RectangleNode';
import CircleNode from '../nodes/CircleNode';
import TextNode from '../nodes/TextNode';
import CanvasToolbar from './CanvasToolbar';
import { FiUpload, FiMessageSquare, FiImage, FiDroplet, FiPackage, FiClipboard } from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';

// Define custom node types
const nodeTypes: NodeTypes = {
  imageUploadNode: ImageUploadNode,
  promptNode: PromptNode,
  imageOutputNode: ImageOutputNode,
  styleExtractorNode: StyleExtractorNode,
  colorExtractorNode: ColorExtractorNode,
  moodboardExtractorNode: MoodboardExtractorNode,
  assetGeneratorNode: AssetGeneratorNode,
  rectangleNode: RectangleNode,
  circleNode: CircleNode,
  textNode: TextNode,
};

const BulbitCanvas: React.FC = () => {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [hasStartedEditing, setHasStartedEditing] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newEdge: Edge = {
          ...params,
          id: `edge-${Date.now()}`,
          type: 'default',
          style: { stroke: '#ff6b6b', strokeWidth: 2 },
          animated: true,
          source: params.source,
          target: params.target,
        };
        setEdges([...edges, newEdge]);
      }
    },
    [edges, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');
      
      if (!data) return;

      try {
        const parsedData = JSON.parse(data);
        const { type, label, data: nodeData } = parsedData;
        
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode: Node = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: nodeData || { label },
        };

        setNodes([...nodes, newNode]);
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    },
    [reactFlowInstance, nodes, setNodes]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  // Empty state component
  const EmptyState = () => (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      zIndex: 10,
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'rgba(26, 26, 26, 0.9)',
        border: '2px solid rgba(255, 107, 107, 0.3)',
        borderRadius: '20px',
        padding: '40px',
        backdropFilter: 'blur(10px)',
        maxWidth: '700px',
        width: '90%'
      }}>
        <div style={{
          fontSize: '48px',
          color: '#ff6b6b',
          marginBottom: '20px'
        }}>
          <FiImage />
        </div>
        <h3 style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: '600',
          margin: '0 0 12px 0'
        }}>
          Welcome to Bulbit AI Canvas
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '16px',
          margin: '0 0 24px 0',
          lineHeight: '1.5'
        }}>
          Start building your AI workflow by dragging nodes from the sidebar
        </p>
        <button
          onClick={() => setHasStartedEditing(true)}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #e74c3c 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
          }}
        >
          Start Editing
        </button>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          marginTop: '16px'
        }}>
          {[
            { icon: <FiUpload />, label: 'Image Upload' },
            { icon: <FiMessageSquare />, label: 'Text Prompt' },
            { icon: <MdPalette />, label: 'Style Extractor' },
            { icon: <FiDroplet />, label: 'Color Extractor' },
            { icon: <FiPackage />, label: 'Asset Generator' },
            { icon: <FiClipboard />, label: 'Moodboard' }
          ].map((item, index) => (
            <div key={index} style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
              fontSize: '13px'
            }}>
              <div style={{ fontSize: '18px', color: '#ff6b6b' }}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="canvas-container" ref={reactFlowWrapper} style={{ 
      background: '#1a1a1a',
      backgroundImage: `
        linear-gradient(rgba(128, 128, 128, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(128, 128, 128, 0.3) 1px, transparent 1px)
      `,
      backgroundSize: '25px 25px',
      width: '100%', 
      height: '100%', 
      position: 'relative' 
    }}>
      <CanvasToolbar />
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            const updatedNodes = changes.reduce((acc, change) => {
              if (change.type === 'position' && change.position) {
                return acc.map(node => 
                  node.id === change.id ? { ...node, position: change.position! } : node
                );
              }
              if (change.type === 'remove') {
                return acc.filter(node => node.id !== change.id);
              }
              return acc;
            }, nodes);
            setNodes(updatedNodes);
          }}
          onEdgesChange={(changes) => {
            const updatedEdges = changes.reduce((acc, change) => {
              if (change.type === 'remove') {
                return acc.filter(edge => edge.id !== change.id);
              }
              return acc;
            }, edges);
            setEdges(updatedEdges);
          }}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{
            type: 'default',
            style: { stroke: '#ff6b6b', strokeWidth: 2 },
            animated: true,
          }}
          attributionPosition="bottom-left"
        >

          <Controls 
            style={{
              background: 'rgba(26, 26, 26, 0.95)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
            }}
          />
          <MiniMap 
            style={{
              background: 'rgba(26, 26, 26, 0.95)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
            }}
            nodeColor="#ff6b6b"
          />
        </ReactFlow>
        {nodes.length === 0 && !hasStartedEditing && <EmptyState />}
      </ReactFlowProvider>
    </div>
  );
};

export default BulbitCanvas;
