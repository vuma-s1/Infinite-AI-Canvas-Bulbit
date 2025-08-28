import React, { useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { FiMove, FiRotateCw, FiTrash2, FiCopy, FiType } from 'react-icons/fi';

interface TextData {
  label: string;
  text: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontWeight: string;
  rotation: number;
}

const TextNode: React.FC<NodeProps<TextData>> = ({ data, selected, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [text, setText] = useState(data.text || 'Double click to edit');
  const nodeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const { setNodes, setEdges } = useReactFlow();

  const handleMouseEnter = () => {
    setTimeout(() => setShowControls(true), 100);
  };
  
  const handleMouseLeave = () => {
    setTimeout(() => setShowControls(false), 200);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      textRef.current?.focus();
      textRef.current?.select();
    }, 100);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const handleRotate = () => {
    // Rotation logic will be implemented
    console.log('Rotate');
  };

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const handleCopy = () => {
    // Copy logic will be implemented
    console.log('Copy');
  };

  return (
    <div
      ref={nodeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'relative',
        cursor: 'pointer',
        transform: `rotate(${data.rotation || 0}deg)`,
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: selected ? '1px dashed #ffffff' : '1px solid transparent',
          borderRadius: '0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '100px',
          minHeight: '40px',
          position: 'relative',
        }}
      >
        {isEditing ? (
          <input
            ref={textRef}
            type="text"
            value={text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyPress={handleKeyPress}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: data.fontColor || '#ffffff',
              fontSize: `${data.fontSize || 16}px`,
              fontFamily: data.fontFamily || 'Arial, sans-serif',
              fontWeight: data.fontWeight || 'normal',
              textAlign: 'center',
              width: '100%',
              minWidth: '80px',
            }}
          />
        ) : (
          <span
            style={{
              color: data.fontColor || '#ffffff',
              fontSize: `${data.fontSize || 16}px`,
              fontFamily: data.fontFamily || 'Arial, sans-serif',
              fontWeight: data.fontWeight || 'normal',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            {text}
          </span>
        )}
      </div>

             {/* Control buttons */}
       {showControls && (
         <div
           style={{
             position: 'absolute',
             top: '-45px',
             left: '50%',
             transform: 'translateX(-50%)',
             display: 'flex',
             gap: '4px',
             backgroundColor: 'rgba(0, 0, 0, 0.9)',
             borderRadius: '8px',
             padding: '6px',
             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
             zIndex: 1000,
           }}
           onMouseEnter={() => setShowControls(true)}
           onMouseLeave={() => setTimeout(() => setShowControls(false), 100)}
         >
          <button
            onClick={handleDoubleClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
            }}
            title="Edit Text"
          >
            <FiType size={14} />
          </button>
          <button
            onClick={handleRotate}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
            }}
            title="Rotate"
          >
            <FiRotateCw size={14} />
          </button>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
            }}
            title="Copy"
          >
            <FiCopy size={14} />
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff6b6b',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
            }}
            title="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TextNode;
