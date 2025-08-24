import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '500px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '48px',
              color: '#ff6b6b',
              marginBottom: '20px'
            }}>
              <FiAlertTriangle />
            </div>
            
            <h2 style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 12px 0'
            }}>
              Something went wrong
            </h2>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              margin: '0 0 32px 0',
              lineHeight: '1.5'
            }}>
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            <button
              onClick={this.handleRetry}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #e74c3c 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #e74c3c 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FiRefreshCw />
              Try Again
            </button>
            
            {this.state.error && (
              <details style={{
                marginTop: '24px',
                textAlign: 'left'
              }}>
                <summary style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Error Details
                </summary>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#ff6b6b',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
