import React from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';
import styles from './FreeTemplatesModal.module.css';

interface FreeTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateUse: (type: 'success' | 'error' | 'info', message: string) => void;
}

const FreeTemplatesModal: React.FC<FreeTemplatesModalProps> = ({ isOpen, onClose, onTemplateUse }) => {
  if (!isOpen) return null;

  const templates = [
    {
      id: 1,
      name: 'Opalhaus',
      creator: 'Pentaclay',
      price: 'FREE',
      category: 'Portfolio & Agency',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center',
      logo: '/templates/opalhaus-logo.png',
      description: 'Visual Collective - Professional portfolio template'
    },
    {
      id: 2,
      name: 'Nivash FZ',
      creator: 'Flowzai',
      price: 'FREE',
      category: 'Real Estate',
      preview: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop&crop=center',
      logo: '/templates/nivash-logo.png',
      description: 'Sustainable Living - Modern real estate template'
    },
    {
      id: 3,
      name: 'Kountex',
      creator: 'Radiant Templates',
      price: '$129 USD',
      category: 'Professional Services',
      preview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&crop=center',
      logo: '/templates/kountex-logo.png',
      description: 'Expert accounting services template'
    },
    {
      id: 4,
      name: 'Monospoke',
      creator: 'EightAM',
      price: 'FREE',
      category: 'Creative & Media',
      preview: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop&crop=center',
      logo: '/templates/monospoke-logo.png',
      description: 'Creative media and podcast template'
    },
    {
      id: 5,
      name: 'Arcoria',
      creator: 'Flowaze',
      price: '$129 USD',
      category: 'Portfolio & Agency',
      preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop&crop=center',
      logo: '/templates/arcoria-logo.png',
      description: 'Interior design and creative agency'
    },
    {
      id: 6,
      name: 'Sandrio',
      creator: 'Finlay Studio',
      price: '$129 USD',
      category: 'Professional Services',
      preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center',
      logo: '/templates/sandrio-logo.png',
      description: 'Building bright futures template'
    },
    {
      id: 7,
      name: 'Thorfin',
      creator: 'Wroney',
      price: 'FREE',
      category: 'Creative & Media',
      preview: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop&crop=center',
      logo: '/templates/thorfin-logo.png',
      description: 'Creative and artistic template'
    },
    {
      id: 8,
      name: 'Bongo',
      creator: 'Rica',
      price: '$59 USD',
      category: 'Retail & Fashion',
      preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&crop=center',
      logo: '/templates/bongo-logo.png',
      description: 'Beauty and fashion template'
    }
  ];

  const handleUseTemplate = (template: any) => {
    try {
      // Simulate template loading
      onTemplateUse('success', `${template.name} template loaded successfully!`);
      onClose();
    } catch (error) {
      onTemplateUse('error', 'Failed to load template');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h2 className={styles.title}>New HTML Templates</h2>
              <p className={styles.subtitle}>
                Modern website templates, recently added from our expert template creators
              </p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.browseAllBtn}>
                Browse all new website templates
                <FiExternalLink />
              </button>
              <button className={styles.closeBtn} onClick={onClose}>
                <FiX />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.templateGrid}>
            {templates.map((template) => (
              <div key={template.id} className={styles.templateCard}>
                                 <div className={styles.previewContainer}>
                   <div className={styles.preview}>
                     <img 
                       src={template.preview} 
                       alt={template.name}
                       className={styles.previewImage}
                       onError={(e) => {
                         // Fallback to placeholder if image fails to load
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                         target.nextElementSibling?.classList.remove(styles.hidden);
                       }}
                     />
                     <div className={`${styles.previewPlaceholder} ${styles.hidden}`}>
                       <span className={styles.previewText}>{template.name}</span>
                       <span className={styles.previewDesc}>{template.description}</span>
                     </div>
                   </div>
                   <div className={styles.categoryBadge}>{template.category}</div>
                 </div>
                
                                 <div className={styles.cardFooter}>
                   <div className={styles.logoPlaceholder}>
                     <span className={styles.logoText}>{template.creator.charAt(0)}</span>
                   </div>
                   <div className={styles.templateInfo}>
                     <h3 className={styles.templateName}>{template.name}</h3>
                     <p className={styles.templateCreator}>{template.creator}</p>
                   </div>
                                       <div className={styles.cardActions}>
                      <div className={styles.price}>{template.price}</div>
                      <button 
                        className={styles.useButton}
                        onClick={() => handleUseTemplate(template)}
                      >
                        Use
                      </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTemplatesModal;
