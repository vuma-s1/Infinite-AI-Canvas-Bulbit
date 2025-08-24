import React, { useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck />;
      case 'error':
        return <FiX />;
      case 'warning':
        return <FiAlertCircle />;
      case 'info':
        return <FiInfo />;
      default:
        return <FiInfo />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      case 'info':
        return styles.info;
      default:
        return styles.info;
    }
  };

  return (
    <div className={`${styles.toast} ${getTypeStyles()}`}>
      <div className={styles.icon}>
        {getIcon()}
      </div>
      <div className={styles.message}>
        {message}
      </div>
      <button
        className={styles.closeButton}
        onClick={() => onClose(id)}
        title="Close"
      >
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
