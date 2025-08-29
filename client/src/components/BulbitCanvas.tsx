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
import AssetGeneratorWorkflow from './AssetGeneratorWorkflow';
import BasicGenerationWorkflow from './BasicGenerationWorkflow';
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

interface BulbitCanvasProps {
  activeWorkflow?: string | null;
}

const BulbitCanvas: React.FC<BulbitCanvasProps> = ({ activeWorkflow }) => {
  const { nodes, edges, setNodes, setEdges, startAutoSave, stopAutoSave } = useWorkflowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [hasStartedEditing, setHasStartedEditing] = useState(false);

  // Initialize auto-save on component mount
  React.useEffect(() => {
    startAutoSave();
    return () => {
      stopAutoSave();
    };
  }, [startAutoSave, stopAutoSave]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newEdge: Edge = {
          ...params,
          id: `edge-${Date.now()}`,
          type: 'default',
          style: { stroke: '#ffffff', strokeWidth: 1 },
          animated: false,
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

  const handleGenerate = () => {
    console.log('Generate workflow:', activeWorkflow);
    // Handle generation logic here
  };



  return (
    <div className="canvas-container" ref={reactFlowWrapper} style={{ 
      background: '#0a0a0a',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      width: '100%', 
      height: '100%', 
      position: 'relative' 
    }}>
      <CanvasToolbar />
      
      {activeWorkflow === 'assetGenerator' ? (
        <AssetGeneratorWorkflow onGenerate={handleGenerate} />
      ) : activeWorkflow === 'basicGeneration' ? (
        <BasicGenerationWorkflow onGenerate={handleGenerate} />
      ) : (
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
            style: { stroke: '#ffffff', strokeWidth: 1 },
            animated: false,
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
      </ReactFlowProvider>
      )}
    </div>
  );
};

export default BulbitCanvas;
