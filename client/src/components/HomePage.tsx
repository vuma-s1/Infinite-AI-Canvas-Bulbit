import React from 'react';
import { FiZap, FiArrowRight, FiLayers, FiCpu, FiPlay } from 'react-icons/fi';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="homepage">
      <div className="homepage-background">
        <div className="gradient-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="homepage-content">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">
              <FiZap />
            </span>
            <span className="logo-text">Bulbit AI</span>
          </div>
        </div>
        
        <div className="hero-section">
          <h1 className="hero-headline">
            The Visual Future, Where Your Ideas Flow with Bulbit
          </h1>
          <p className="hero-subtitle">
            Create, connect, and execute AI-powered workflows with our intuitive visual builder
          </p>
          
          <button className="get-started-btn" onClick={onGetStarted}>
            <span>Get Started</span>
            <FiArrowRight />
          </button>
        </div>
        
        <div className="features-section">
          <div className="feature">
            <div className="feature-icon">
              <FiLayers />
            </div>
            <h3>Visual Workflow Builder</h3>
            <p>Drag and drop nodes to create complex AI workflows</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <FiCpu />
            </div>
            <h3>AI-Powered Processing</h3>
            <p>Generate images, extract colors, and create moodboards</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <FiPlay />
            </div>
            <h3>Instant Execution</h3>
            <p>Run your workflows with a single click</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
