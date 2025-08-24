import axios from 'axios';
import { Node, Edge } from 'reactflow';

interface ExecutionState {
  nodes: Node[];
  edges: Edge[];
  updateNodeData: (nodeId: string, payload: any) => void;
}

const API_BASE_URL = 'http://localhost:3001';

const uploadImageToServer = async (imageUrl: string): Promise<File> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const filename = `image-${Date.now()}.png`;
    return new File([blob], filename, { type: 'image/png' });
  } catch (error) {
    console.error('Error converting image URL to file:', error);
    throw error;
  }
};

export async function runWorkflow(getState: () => ExecutionState, _setState: (updater: (state: ExecutionState) => ExecutionState) => void) {
  const state = getState();
  const { nodes, edges, updateNodeData } = state;

  try {
    // Simple linear traversal from left to right
    const sortedNodes = nodes.sort((a, b) => a.position.x - b.position.x);
    
    for (let i = 0; i < sortedNodes.length; i++) {
      const currentNode = sortedNodes[i];
      
      // Set loading state for all node types
      updateNodeData(currentNode.id, { isLoading: true, error: null });
      
      try {
        let response;
        
        if (currentNode.type === 'promptNode' && currentNode.data?.prompt) {
          // Basic prompt-based image generation
          response = await axios.post(`${API_BASE_URL}/api/generate-from-prompt`, {
            prompt: currentNode.data.prompt
          });
          
          // Find the next node in the sequence (output node)
          const nextNode = sortedNodes[i + 1];
          if (nextNode && nextNode.type === 'imageOutputNode') {
            updateNodeData(nextNode.id, {
              imageUrl: response.data.imageUrl,
              isLoading: false,
              error: null
            });
          }
          
        } else if (currentNode.type === 'styleExtractorNode') {
          // Handle style extraction
          if (currentNode.data.styleImageUrl && currentNode.data.objectImageUrl) {
            const formData = new FormData();
            
            // Convert image URLs to files
            const styleFile = await uploadImageToServer(currentNode.data.styleImageUrl);
            const objectFile = await uploadImageToServer(currentNode.data.objectImageUrl);
            
            formData.append('styleImage', styleFile);
            formData.append('objectImage', objectFile);
            formData.append('prompt', currentNode.data.prompt || 'Apply the extracted style to the object');
            
            response = await axios.post(`${API_BASE_URL}/api/extract-style`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Update the node with extracted style
            updateNodeData(currentNode.id, {
              extractedStyle: response.data.extractedStyle,
              isLoading: false
            });
            
            // Find output node and update it
            const outputEdges = edges.filter(edge => edge.source === currentNode.id);
            if (outputEdges.length > 0) {
              const outputNodeId = outputEdges[0].target;
              updateNodeData(outputNodeId, {
                imageUrl: response.data.styledImageUrl,
                isLoading: false
              });
            }
          }
          
        } else if (currentNode.type === 'colorExtractorNode') {
          // Handle color extraction
          if (currentNode.data.colorReferenceUrl && currentNode.data.objectReferenceUrl) {
            const formData = new FormData();
            
            const colorFile = await uploadImageToServer(currentNode.data.colorReferenceUrl);
            const objectFile = await uploadImageToServer(currentNode.data.objectReferenceUrl);
            
            formData.append('colorReference', colorFile);
            formData.append('objectReference', objectFile);
            
            response = await axios.post(`${API_BASE_URL}/api/extract-colors`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Update the node with extracted palette
            updateNodeData(currentNode.id, {
              extractedPalette: response.data.extractedPalette,
              isLoading: false
            });
            
            // Find output node and update it
            const outputEdges = edges.filter(edge => edge.source === currentNode.id);
            if (outputEdges.length > 0) {
              const outputNodeId = outputEdges[0].target;
              updateNodeData(outputNodeId, {
                imageUrl: response.data.colorizedImageUrl,
                isLoading: false
              });
            }
          }
          
        } else if (currentNode.type === 'moodboardExtractorNode') {
          // Handle moodboard generation
          const formData = new FormData();
          
          // Collect all uploaded elements
          const elements = [
            currentNode.data.logoUrl,
            currentNode.data.colorPaletteUrl,
            currentNode.data.fontPairingUrl,
            currentNode.data.designStyleUrl,
            currentNode.data.patternUrl,
            currentNode.data.texturesUrl,
            currentNode.data.mockupsUrl,
            currentNode.data.iconsUrl
          ].filter(Boolean);
          
          for (const elementUrl of elements) {
            const file = await uploadImageToServer(elementUrl);
            formData.append('elements', file);
          }
          
          formData.append('description', currentNode.data.prompt || 'Create a comprehensive moodboard');
          
          response = await axios.post(`${API_BASE_URL}/api/generate-moodboard`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          // Find output node and update it
          const outputEdges = edges.filter(edge => edge.source === currentNode.id);
          if (outputEdges.length > 0) {
            const outputNodeId = outputEdges[0].target;
            updateNodeData(outputNodeId, {
              imageUrl: response.data.moodboardUrl,
              isLoading: false
            });
          }
          
        } else if (currentNode.type === 'assetGeneratorNode') {
          // Handle asset generation
          if (currentNode.data.brandingSourceUrl) {
            const formData = new FormData();
            
            const brandingFile = await uploadImageToServer(currentNode.data.brandingSourceUrl);
            formData.append('brandingSource', brandingFile);
            
            // Add content assets if available
            const contentAssets = [
              currentNode.data.illustrationsUrl,
              currentNode.data.mockupsUrl,
              currentNode.data.sketchesUrl
            ].filter(Boolean);
            
            for (const assetUrl of contentAssets) {
              const file = await uploadImageToServer(assetUrl);
              formData.append('contentAssets', file);
            }
            
            response = await axios.post(`${API_BASE_URL}/api/generate-assets`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Update the node with extracted branding
            updateNodeData(currentNode.id, {
              extractedBranding: response.data.extractedBranding,
              isLoading: false
            });
            
            // Find output nodes and update them
            const outputEdges = edges.filter(edge => edge.source === currentNode.id);
            response.data.generatedAssets.forEach((assetUrl: string, index: number) => {
              if (outputEdges[index]) {
                const outputNodeId = outputEdges[index].target;
                updateNodeData(outputNodeId, {
                  imageUrl: assetUrl,
                  isLoading: false
                });
              }
            });
          }
        }
        
        // Clear loading state for current node
        updateNodeData(currentNode.id, { isLoading: false });
        
      } catch (error) {
        console.error('Error executing node:', currentNode.id, error);
        
        // Set error state
        updateNodeData(currentNode.id, {
          isLoading: false,
          error: 'Processing failed'
        });
        
        // Also update output nodes if they exist
        const outputEdges = edges.filter(edge => edge.source === currentNode.id);
        outputEdges.forEach(edge => {
          updateNodeData(edge.target, {
            isLoading: false,
            error: 'Processing failed'
          });
        });
      }
    }
  } catch (error) {
    console.error('Workflow execution failed:', error);
    throw error;
  }
}

// Helper function to get input data for a node
export function getNodeInputData(nodeId: string, nodes: Node[], edges: Edge[]) {
  const incomingEdges = edges.filter(edge => edge.target === nodeId);
  const inputData: any[] = [];
  
  incomingEdges.forEach(edge => {
    const sourceNode = nodes.find(node => node.id === edge.source);
    if (sourceNode) {
      inputData.push(sourceNode.data);
    }
  });
  
  return inputData;
}
