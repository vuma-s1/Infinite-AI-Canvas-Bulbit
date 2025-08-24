import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiPlus } from 'react-icons/fi';
import { useWorkflowStore } from '../store/workflowStore';
import styles from './NodeSearch.module.css';

interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface NodeSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNodeSelect: (nodeType: string, label: string) => void;
  nodeTemplates: Record<string, NodeTemplate[]>;
}

const NodeSearch: React.FC<NodeSearchProps> = ({
  isOpen,
  onClose,
  onNodeSelect,
  nodeTemplates
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { nodes } = useWorkflowStore();

  // Flatten all node templates into a single array
  const allNodes = Object.values(nodeTemplates).flat();

  // Filter nodes based on search term
  const filteredNodes = allNodes.filter(node =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredNodes.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredNodes.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredNodes[selectedIndex]) {
          const node = filteredNodes[selectedIndex];
          onNodeSelect(node.type, node.label);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleNodeClick = (node: NodeTemplate) => {
    onNodeSelect(node.type, node.label);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.searchModal} onClick={e => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <div className={styles.searchInputContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={styles.clearButton}
              >
                <FiX />
              </button>
            )}
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
        </div>

        <div className={styles.searchResults}>
          {filteredNodes.length === 0 ? (
            <div className={styles.noResults}>
              <p>No nodes found for "{searchTerm}"</p>
              <p>Try a different search term</p>
            </div>
          ) : (
            <div className={styles.resultsList}>
              {filteredNodes.map((node, index) => (
                <div
                  key={node.type}
                  className={`${styles.resultItem} ${
                    index === selectedIndex ? styles.selected : ''
                  }`}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div 
                    className={styles.nodeIcon}
                    style={{ backgroundColor: node.color }}
                  >
                    {node.icon}
                  </div>
                  <div className={styles.nodeInfo}>
                    <span className={styles.nodeLabel}>{node.label}</span>
                    <span className={styles.nodeDescription}>
                      {node.description}
                    </span>
                  </div>
                  <div className={styles.addButton}>
                    <FiPlus />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.searchFooter}>
          <div className={styles.shortcuts}>
            <span>↑↓ Navigate</span>
            <span>Enter Select</span>
            <span>Esc Close</span>
          </div>
          <div className={styles.resultCount}>
            {filteredNodes.length} of {allNodes.length} nodes
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeSearch;
