import React, { useState, useRef, useEffect } from 'react';
import styles from './TemplateDropdown.module.css';
import { FiZap } from 'react-icons/fi';

interface TemplateDropdownProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    action: () => void;
    nodeType?: string;
    data?: any;
  }>;
  onTemplateLoad: () => void;
  onGenerateClick: (templateType: string) => void;
}

const TemplateDropdown: React.FC<TemplateDropdownProps> = ({ 
  label, 
  description, 
  icon, 
  items, 
  onTemplateLoad,
  onGenerateClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTemplateClick = () => {
    onGenerateClick(label);
    setIsOpen(false);
  };

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: item.nodeType,
      label: item.label,
      ...item.data
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={styles.templateDropdownContainer} ref={dropdownRef}>
      <button 
        className={`${styles.templateBtn} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.templateIcon}>
          {icon}
        </span>
        <div className={styles.templateInfo}>
          <span className={styles.templateName}>{label}</span>
          <span className={styles.templateDesc}>{description}</span>
        </div>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.templateAction}>
                         <button 
               className={styles.loadTemplateBtn}
               onClick={handleTemplateClick}
             >
               <FiZap />
               <span>Generate</span>
             </button>
          </div>
          
          <div className={styles.dropdownGrid}>
            {items.map((item, index) => (
              <button
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleItemClick(item.action)}
                draggable={!!item.nodeType}
                onDragStart={(e) => item.nodeType && handleDragStart(e, item)}
                title={item.label}
              >
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemLabel}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDropdown;
