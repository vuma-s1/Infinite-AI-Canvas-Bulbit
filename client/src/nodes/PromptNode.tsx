import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './PromptNode.module.css';
import { FiMessageSquare, FiZap } from 'react-icons/fi';
import { MdLightbulb } from 'react-icons/md';
import { generateSampleImage, generateMultipleImages, getSamplePrompts } from '../services/sampleImageService';

interface PromptNodeData {
  prompt?: string;
  isLoading?: boolean;
  error?: string;
  generatedImages?: string[];
}

interface PromptNodeProps {
  data: PromptNodeData;
  id: string;
}

const PromptNode: React.FC<PromptNodeProps> = ({ data, id }) => {
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const { updateNodeData } = useWorkflowStore();

  const samplePrompts = getSamplePrompts();

  useEffect(() => {
    // Update height based on content
    const textarea = document.getElementById(`prompt-textarea-${id}`) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      setTextareaHeight(`${textarea.scrollHeight}px`);
    }
  }, [prompt, id]);

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = event.target.value;
    setPrompt(newPrompt);
    updateNodeData(id, { prompt: newPrompt });
  };

  const handleSamplePromptClick = (samplePrompt: string) => {
    setPrompt(samplePrompt);
    updateNodeData(id, { prompt: samplePrompt });
    setShowSamples(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);
    updateNodeData(id, { isLoading: true, error: null });

    try {
      // Generate multiple sample images based on prompt
      const generatedImages = await generateMultipleImages(prompt, 4);
      
      // Find connected output nodes and update them
      const { edges, nodes } = useWorkflowStore.getState();
      const connectedEdges = edges.filter(edge => edge.source === id);
      
      connectedEdges.forEach(edge => {
        const targetNode = nodes.find(node => node.id === edge.target);
        if (targetNode && targetNode.type === 'imageOutputNode') {
          useWorkflowStore.getState().updateNodeData(edge.target, { 
            imageUrl: generatedImages[0], // First image as primary
            allImages: generatedImages, // All images for gallery
            isLoading: false 
          });
        }
      });
      
      // Update the node data to indicate success
      updateNodeData(id, { 
        isLoading: false,
        generatedImages: generatedImages
      });
    } catch (error) {
      console.error('Generation failed:', error);
      updateNodeData(id, { isLoading: false, error: 'Generation failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.nodeContainer}>
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
      />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <FiMessageSquare />
          </div>
          <div className={styles.title}>Text Prompt</div>
          <button
            className={styles.sampleButton}
            onClick={() => setShowSamples(!showSamples)}
            title="Show sample prompts"
          >
            <MdLightbulb />
          </button>
        </div>
        
        {showSamples && (
          <div className={styles.samplePrompts}>
            <div className={styles.sampleTitle}>Sample Prompts:</div>
            {samplePrompts.map((samplePrompt, index) => (
              <button
                key={index}
                className={styles.samplePrompt}
                onClick={() => handleSamplePromptClick(samplePrompt)}
              >
                {samplePrompt}
              </button>
            ))}
          </div>
        )}
        
        <textarea
          id={`prompt-textarea-${id}`}
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your prompt... (e.g., 'A beautiful landscape with mountains')"
          className={styles.textarea}
          style={{ height: textareaHeight }}
          disabled={isGenerating}
        />
        
        <button
          className={`${styles.generateButton} ${isGenerating ? styles.generating : ''}`}
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <div className={styles.buttonSpinner}></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FiZap className={styles.buttonIcon} />
              <span>Generate Images</span>
            </>
          )}
        </button>


      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
      />
    </div>
  );
};

export default PromptNode;
