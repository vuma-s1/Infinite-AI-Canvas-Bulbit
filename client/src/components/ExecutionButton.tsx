import React, { useState } from 'react';
import { runWorkflow } from './ExecutionEngine';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './ExecutionButton.module.css';
import { FiZap, FiActivity, FiCheck, FiAlertCircle } from 'react-icons/fi';

const ExecutionButton: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecutionStatus, setLastExecutionStatus] = useState<'success' | 'error' | null>(null);
  const { nodes, edges } = useWorkflowStore();

  const handleExecute = async () => {
    if (nodes.length === 0) {
      alert('Please add some nodes to your workflow first!');
      return;
    }

    setIsExecuting(true);
    setLastExecutionStatus(null);
    
    try {
      await runWorkflow(
        () => ({ nodes, edges, updateNodeData: useWorkflowStore.getState().updateNodeData }),
        (updater) => useWorkflowStore.setState(updater(useWorkflowStore.getState()))
      );
      setLastExecutionStatus('success');
      
      // Clear success status after 3 seconds
      setTimeout(() => setLastExecutionStatus(null), 3000);
    } catch (error) {
      console.error('Workflow execution failed:', error);
      setLastExecutionStatus('error');
      alert('Workflow execution failed. Please check your configuration.');
      
      // Clear error status after 5 seconds
      setTimeout(() => setLastExecutionStatus(null), 5000);
    } finally {
      setIsExecuting(false);
    }
  };

  const hasNodes = nodes.length > 0;
  const hasConnections = edges.length > 0;

  const getButtonIcon = () => {
    if (isExecuting) return <FiActivity className={styles.spinningIcon} />;
    if (lastExecutionStatus === 'success') return <FiCheck />;
    if (lastExecutionStatus === 'error') return <FiAlertCircle />;
    return <FiZap />;
  };

  const getButtonText = () => {
    if (isExecuting) return 'Executing...';
    if (lastExecutionStatus === 'success') return 'Success';
    if (lastExecutionStatus === 'error') return 'Failed';
    return 'Execute';
  };

  return (
    <button
      className={`${styles.executionButton} ${isExecuting ? styles.executing : ''} ${!hasNodes ? styles.disabled : ''} ${lastExecutionStatus ? styles[lastExecutionStatus] : ''}`}
      onClick={handleExecute}
      disabled={isExecuting || !hasNodes}
      title={hasNodes ? `${nodes.length} node${nodes.length !== 1 ? 's' : ''}${hasConnections ? ` • ${edges.length} connection${edges.length !== 1 ? 's' : ''}` : ''}` : 'Add nodes to execute workflow'}
    >
      <div className={styles.buttonContent}>
        <span className={styles.buttonIcon}>
          {getButtonIcon()}
        </span>
        <span>{getButtonText()}</span>
      </div>
    </button>
  );
};

export default ExecutionButton;
