import React, { useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { FiMove, FiRotateCw, FiTrash2, FiCopy, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface CircleData {
  label: string;
  radius: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  rotation: number;
}

const CircleNode: React.FC<NodeProps<CircleData>> = ({ data, selected, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const { setNodes, setEdges } = useReactFlow();

  const handleMouseEnter = () => {
    setTimeout(() => setShowControls(true), 100);
  };
  
  const handleMouseLeave = () => {
    setTimeout(() => setShowControls(false), 200);
  };

  const handleDoubleClick = () => setIsEditing(true);

  const handleResize = (direction: string, delta: { x: number; y: number }) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          const currentData = node.data as CircleData;
          let newRadius = currentData.radius || 50;
          
          switch (direction) {
            case 'n':
            case 's':
            case 'e':
            case 'w':
              newRadius = Math.max(10, newRadius + 5);
              break;
            case 'ne':
            case 'nw':
            case 'se':
            case 'sw':
              newRadius = Math.max(10, newRadius + 5);
              break;
          }
          
          return {
            ...node,
            data: {
              ...currentData,
              radius: newRadius,
            },
          };
        }
        return node;
      })
    );
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

  const diameter = (data.radius || 50) * 2;

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
           width: diameter,
           height: diameter,
           backgroundColor: 'transparent',
           border: `1px solid #ffffff`,
           borderRadius: '50%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           position: 'relative',
         }}
       >
        
                 {/* Resize handles */}
         {selected && (
           <>
             {/* Edge handles */}
             <div
               style={{
                 position: 'absolute',
                 top: '-8px',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 width: '16px',
                 height: '16px',
                 backgroundColor: '#ff6b6b',
                 border: '2px solid #ffffff',
                 borderRadius: '50%',
                 cursor: 'n-resize',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
               }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 handleResize('n', { x: 0, y: 0 });
               }}
             />
             <div
               style={{
                 position: 'absolute',
                 bottom: '-8px',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 width: '16px',
                 height: '16px',
                 backgroundColor: '#ff6b6b',
                 border: '2px solid #ffffff',
                 borderRadius: '50%',
                 cursor: 's-resize',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
               }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 handleResize('s', { x: 0, y: 0 });
               }}
             />
             <div
               style={{
                 position: 'absolute',
                 top: '50%',
                 left: '-8px',
                 transform: 'translateY(-50%)',
                 width: '16px',
                 height: '16px',
                 backgroundColor: '#ff6b6b',
                 border: '2px solid #ffffff',
                 borderRadius: '50%',
                 cursor: 'w-resize',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
               }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 handleResize('w', { x: 0, y: 0 });
               }}
             />
             <div
               style={{
                 position: 'absolute',
                 top: '50%',
                 right: '-8px',
                 transform: 'translateY(-50%)',
                 width: '16px',
                 height: '16px',
                 backgroundColor: '#ff6b6b',
                 border: '2px solid #ffffff',
                 borderRadius: '50%',
                 cursor: 'e-resize',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
               }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 handleResize('e', { x: 0, y: 0 });
               }}
             />
             
             {/* Directional arrows */}
             <div
               style={{
                 position: 'absolute',
                 top: '-25px',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 color: '#ff6b6b',
                 cursor: 'n-resize',
               }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 handleResize('n', { x: 0, y: 0 });
               }}
             >
               <FiArrowUp size={16} />
             </div>
             <div
               style={{
                 position: 'absolute',
                 bottom: '-25px',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 color: '#ff6b6b',
                 cursor: 's-resize',
               }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 handleResize('s', { x: 0, y: 0 });
               }}
             >
               <FiArrowDown size={16} />
             </div>
             <div
               style={{
                 position: 'absolute',
                 top: '50%',
                 left: '-25px',
                 transform: 'translateY(-50%)',
                 color: '#ff6b6b',
                 cursor: 'w-resize',
               }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 handleResize('w', { x: 0, y: 0 });
               }}
             >
               <FiArrowLeft size={16} />
             </div>
             <div
               style={{
                 position: 'absolute',
                 top: '50%',
                 right: '-25px',
                 transform: 'translateY(-50%)',
                 color: '#ff6b6b',
                 cursor: 'e-resize',
               }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 handleResize('e', { x: 0, y: 0 });
               }}
             >
               <FiArrowRight size={16} />
             </div>
           </>
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

export default CircleNode;
