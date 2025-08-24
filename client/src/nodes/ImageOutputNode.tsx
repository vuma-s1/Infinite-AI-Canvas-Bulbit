import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FiTrash2, FiDownload, FiMaximize2 } from 'react-icons/fi';
import { useReactFlow } from 'reactflow';

interface ImageOutputNodeData {
  imageUrl: string;
  prompt: string;
  templateType: string;
}

interface ImageOutputNodeProps {
  id: string;
  data: ImageOutputNodeData;
}

const ImageOutputNode: React.FC<ImageOutputNodeProps> = ({ id, data }) => {
  const { setNodes, setEdges } = useReactFlow();
  const [showControls, setShowControls] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = data.imageUrl;
    link.download = `generated-image-${id}.jpg`;
    link.click();
  };

  const handleMouseEnter = () => {
    setTimeout(() => setShowControls(true), 100);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setShowControls(false), 200);
  };

  return (
    <div
      className="image-output-node"
      style={{
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-block'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#ff6b6b' }} />
      
      {/* Control Buttons */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            display: 'flex',
            gap: '4px',
            zIndex: 10
          }}
        >
          <button
            onClick={handleDownload}
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}
            title="Download"
          >
            <FiDownload size={12} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <FiMaximize2 size={12} />
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}
            title="Delete"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}

      {/* Image */}
      <img
        src={data.imageUrl}
        alt="Generated"
        style={{
          width: isExpanded ? '300px' : '200px',
          height: isExpanded ? '225px' : '150px',
          objectFit: 'cover',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease'
        }}
      />

      {/* Info (only show when expanded) */}
      {isExpanded && (
        <div style={{ 
          position: 'absolute',
          bottom: '-30px',
          left: '0',
          right: '0',
          color: '#ffffff',
          fontSize: '11px',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontStyle: 'italic'
        }}>
          "{data.prompt}"
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: '#ff6b6b' }} />
    </div>
  );
};

export default ImageOutputNode;
