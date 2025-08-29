import React, { useState, useRef } from 'react';
import { FiUpload, FiArrowRight, FiPlus, FiImage, FiMessageSquare, FiDroplet } from 'react-icons/fi';

interface BasicGenerationWorkflowProps {
  onGenerate: () => void;
}

interface Node {
  id: string;
  type: 'prompt' | 'color' | 'image' | 'action' | 'result';
  position: { x: number; y: number };
  data: {
    label: string;
    content?: string;
    color?: string;
    imageUrl?: string;
  };
}

interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'default' | 'dashed';
}

const BasicGenerationWorkflow: React.FC<BasicGenerationWorkflowProps> = ({ onGenerate }) => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'initial-prompt',
      type: 'prompt',
      position: { x: 50, y: 100 },
      data: {
        label: 'Initial Prompt',
        content: 'A magical, glowing blossom with shifting rainbow colors, suspended in a dark, star-speckled dreamscape.'
      }
    },
    {
      id: 'initial-image',
      type: 'image',
      position: { x: 300, y: 100 },
      data: {
        label: 'Initial Image',
        imageUrl: '/placeholder-image.jpg'
      }
    },
    {
      id: 'color-change',
      type: 'action',
      position: { x: 550, y: 100 },
      data: {
        label: 'Change the color of the flower to the uploaded image'
      }
    },
    {
      id: 'french-fuchsia',
      type: 'color',
      position: { x: 800, y: 100 },
      data: {
        label: 'FRENCH FUCHSIA',
        color: '#FE3486'
      }
    },
    {
      id: 'result-1',
      type: 'result',
      position: { x: 1050, y: 100 },
      data: {
        label: 'Result Image 1'
      }
    }
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { id: 'conn-1', source: 'initial-prompt', target: 'initial-image', type: 'default' },
    { id: 'conn-2', source: 'initial-image', target: 'color-change', type: 'default' },
    { id: 'conn-3', source: 'color-change', target: 'french-fuchsia', type: 'dashed' },
    { id: 'conn-4', source: 'french-fuchsia', target: 'result-1', type: 'default' }
  ]);

  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [draggedConnection, setDraggedConnection] = useState<{ source: string; startPos: { x: number; y: number } } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNode(nodeId);
  };

  const handleNodeDrag = (e: React.MouseEvent) => {
    if (draggedNode) {
      setNodes(prev => prev.map(node => 
        node.id === draggedNode 
          ? { ...node, position: { x: mousePos.x - 50, y: mousePos.y - 25 } }
          : node
      ));
    }
  };

  const handleNodeDragEnd = () => {
    setDraggedNode(null);
  };

  const handleConnectionStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDraggedConnection({
        source: nodeId,
        startPos: { x: node.position.x + 150, y: node.position.y + 25 }
      });
    }
  };

  const handleConnectionEnd = (e: React.MouseEvent, targetNodeId: string) => {
    e.stopPropagation();
    if (draggedConnection && draggedConnection.source !== targetNodeId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        source: draggedConnection.source,
        target: targetNodeId,
        type: 'default'
      };
      setConnections(prev => [...prev, newConnection]);
    }
    setDraggedConnection(null);
  };

  const renderNode = (node: Node) => {
    const isDragging = draggedNode === node.id;
    const isConnectionSource = draggedConnection?.source === node.id;

    const baseStyle = {
      position: 'absolute' as const,
      left: node.position.x,
      top: node.position.y,
      width: 150,
      minHeight: 50,
      backgroundColor: 'rgba(128, 0, 128, 0.3)',
      border: '1px solid #ffffff',
      borderRadius: '8px',
      padding: '10px',
      cursor: isDragging ? 'grabbing' : 'grab',
      zIndex: isDragging ? 1000 : 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '12px',
      textAlign: 'center' as const
    };

    const connectionHandleStyle = {
      position: 'absolute' as const,
      right: '-8px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '16px',
      height: '16px',
      backgroundColor: isConnectionSource ? '#ff6b6b' : '#ffffff',
      border: '2px solid #ffffff',
      borderRadius: '50%',
      cursor: 'crosshair',
      zIndex: 1001
    };

    const inputHandleStyle = {
      position: 'absolute' as const,
      left: '-8px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '16px',
      height: '16px',
      backgroundColor: '#ffffff',
      border: '2px solid #ffffff',
      borderRadius: '50%',
      cursor: 'crosshair',
      zIndex: 1001
    };

    return (
      <div
        key={node.id}
        style={baseStyle}
        onMouseDown={(e) => handleNodeDragStart(e, node.id)}
        onMouseMove={handleNodeDrag}
        onMouseUp={handleNodeDragEnd}
      >
        {/* Input Handle */}
        <div
          style={inputHandleStyle}
          onMouseDown={(e) => handleConnectionEnd(e, node.id)}
        />
        
        {/* Node Content */}
        <div style={{ marginBottom: '5px' }}>
          {node.type === 'prompt' && <FiMessageSquare size={16} />}
          {node.type === 'image' && <FiImage size={16} />}
          {node.type === 'color' && <FiDroplet size={16} />}
          {node.type === 'action' && <FiArrowRight size={16} />}
          {node.type === 'result' && <FiImage size={16} />}
        </div>
        
        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
          {node.data.label}
        </div>
        
        {node.data.content && (
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            {node.data.content}
          </div>
        )}
        
        {node.data.color && (
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: node.data.color,
              border: '1px solid #ffffff',
              borderRadius: '4px',
              marginTop: '5px'
            }}
          />
        )}

        {/* Output Handle */}
        <div
          style={connectionHandleStyle}
          onMouseDown={(e) => handleConnectionStart(e, node.id)}
        />
      </div>
    );
  };

  const renderConnection = (connection: Connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return null;

    const startX = sourceNode.position.x + 150;
    const startY = sourceNode.position.y + 25;
    const endX = targetNode.position.x;
    const endY = targetNode.position.y + 25;

    const path = `M ${startX} ${startY} L ${endX} ${endY}`;

    return (
      <svg
        key={connection.id}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <path
          d={path}
          stroke="#ffffff"
          strokeWidth={connection.type === 'dashed' ? '2' : '2'}
          strokeDasharray={connection.type === 'dashed' ? '5,5' : 'none'}
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    );
  };

  const renderDraggedConnection = () => {
    if (!draggedConnection) return null;

    const sourceNode = nodes.find(n => n.id === draggedConnection.source);
    if (!sourceNode) return null;

    const startX = sourceNode.position.x + 150;
    const startY = sourceNode.position.y + 25;
    const endX = mousePos.x;
    const endY = mousePos.y;

    const path = `M ${startX} ${startY} L ${endX} ${endY}`;

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999
        }}
      >
        <path
          d={path}
          stroke="#ff6b6b"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
        />
      </svg>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 1002
      }}>
        <h2 style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0'
        }}>
          Basic Generation
        </h2>
        <p style={{
          color: '#cccccc',
          fontSize: '14px',
          margin: '5px 0 0 0'
        }}>
          Interactive image generation workflow
        </p>
      </div>

      {/* Arrow Marker Definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#ffffff"
            />
          </marker>
        </defs>
      </svg>

      {/* Connections */}
      {connections.map(renderConnection)}
      {renderDraggedConnection()}

      {/* Nodes */}
      {nodes.map(renderNode)}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: '#ff6b6b',
          border: 'none',
          borderRadius: '8px',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 1002
        }}
      >
        Generate Workflow
      </button>
    </div>
  );
};

export default BasicGenerationWorkflow;







