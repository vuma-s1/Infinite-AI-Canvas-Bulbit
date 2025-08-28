import React, { useState, useRef, useEffect } from 'react';
import styles from './MenuDropdown.module.css';
import { 
  FiFile, FiSave, FiFolder, FiDownload, FiPrinter, FiSettings,
  FiCopy, FiScissors, FiClipboard, FiRotateCcw, FiRotateCw, FiSearch, FiEdit,
  FiZoomIn, FiZoomOut, FiGrid, FiEye, FiMaximize2, FiMinimize2,
  FiLayers, FiMove, FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify,
  FiStar, FiShield, FiHelpCircle, FiInfo, FiBook, FiGithub,
  FiSquare, FiCircle, FiTriangle, FiHexagon, FiOctagon,
  FiArrowRight, FiArrowLeft, FiArrowUp, FiArrowDown, FiArrowUpRight,
  FiMessageSquare, FiImage, FiFileText, FiDatabase, FiCpu
} from 'react-icons/fi';

interface MenuDropdownProps {
  label: string;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    action: () => void;
  }>;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ label, items }) => {
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

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button 
        className={`${styles.menuItem} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownList}>
            {items.map((item, index) => (
              <button
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleItemClick(item.action)}
                title={item.label}
              >
                <span className={styles.itemLabel}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
