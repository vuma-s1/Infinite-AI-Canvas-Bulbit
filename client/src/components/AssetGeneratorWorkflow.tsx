import React, { useState } from 'react';
import { FiUpload, FiArrowRight } from 'react-icons/fi';

interface AssetGeneratorWorkflowProps {
  onGenerate: () => void;
}

const AssetGeneratorWorkflow: React.FC<AssetGeneratorWorkflowProps> = ({ onGenerate }) => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    branding: File | null;
    illustrations: File | null;
    mockups: File | null;
    sketches: File | null;
  }>({
    branding: null,
    illustrations: null,
    mockups: null,
    sketches: null,
  });

  const [prompts, setPrompts] = useState<{
    branding: string;
    illustrations: string;
    mockups: string;
    sketches: string;
  }>({
    branding: '',
    illustrations: '',
    mockups: '',
    sketches: '',
  });

  const handleFileUpload = (type: keyof typeof uploadedFiles, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
  };

  const handlePromptChange = (type: keyof typeof prompts, value: string) => {
    setPrompts(prev => ({ ...prev, [type]: value }));
  };

  const handleDrop = (e: React.DragEvent, type: keyof typeof uploadedFiles) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(type, files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: '20px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0'
        }}>
          Asset Generator
        </h2>
        <p style={{
          color: '#cccccc',
          fontSize: '14px',
          margin: '5px 0 0 0'
        }}>
          Extract branding and apply to multiple assets
        </p>
      </div>

      {/* Main Workflow Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '100%',
        maxWidth: '800px'
      }}>
        {/* Top Section - Branding Extraction */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div
            style={{
              width: '300px',
              height: '120px',
              backgroundColor: 'rgba(128, 0, 128, 0.3)',
              border: '1px solid #ffffff',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
            onDrop={(e) => handleDrop(e, 'branding')}
            onDragOver={handleDragOver}
          >
            <FiUpload size={24} color="#ffffff" />
            <span style={{ color: '#ffffff', marginTop: '8px' }}>
              {uploadedFiles.branding ? uploadedFiles.branding.name : 'Upload file'}
            </span>
          </div>
          <div style={{
            color: '#ffffff',
            fontSize: '12px',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            Extract the Style, color, or the entire branding and keep it universal across all generations
          </div>
        </div>

        {/* Middle Section - Input and Output */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '40px'
        }}>
          {/* Left Side - Input Boxes */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {[
              { key: 'illustrations', label: 'Illustrations, objects or icons' },
              { key: 'mockups', label: 'Landing pages & Mockups' },
              { key: 'sketches', label: 'Hand Drawn Sketches' }
            ].map((item) => (
              <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    width: '200px',
                    height: '80px',
                    backgroundColor: 'rgba(128, 0, 128, 0.3)',
                    border: '1px solid #ffffff',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onDrop={(e) => handleDrop(e, item.key as keyof typeof uploadedFiles)}
                  onDragOver={handleDragOver}
                >
                  <FiUpload size={20} color="#ffffff" />
                  <span style={{ color: '#ffffff', fontSize: '12px', marginTop: '4px' }}>
                    {uploadedFiles[item.key as keyof typeof uploadedFiles] 
                      ? uploadedFiles[item.key as keyof typeof uploadedFiles]?.name 
                      : 'Upload file'}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={`Prompt for ${item.label}`}
                  value={prompts[item.key as keyof typeof prompts]}
                  onChange={(e) => handlePromptChange(item.key as keyof typeof prompts, e.target.value)}
                  style={{
                    width: '200px',
                    padding: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Center - Connecting Lines */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center'
          }}>
            {/* Vertical line from top */}
            <div style={{
              width: '2px',
              height: '60px',
              backgroundColor: '#ffffff'
            }} />
            
            {/* Horizontal lines with text */}
            {[
              'Apply the universal branding to these',
              'Apply the universal branding to these',
              'Apply the universal branding to these'
            ].map((text, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '120px',
                  height: '2px',
                  backgroundColor: '#ffffff',
                  borderStyle: 'dotted'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '10px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Right Side - Output Boxes */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {[
              'Final Image 1',
              'Final Image 2', 
              'Final Image 3'
            ].map((label, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center'
              }}>
                <div
                  style={{
                    width: '200px',
                    height: '80px',
                    backgroundColor: 'rgba(128, 0, 128, 0.3)',
                    border: '1px solid #ffffff',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: '#ffffff', fontSize: '12px' }}>
                    Generated Image
                  </span>
                </div>
                <span style={{
                  color: '#ffffff',
                  fontSize: '12px',
                  textAlign: 'center'
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetGeneratorWorkflow;







