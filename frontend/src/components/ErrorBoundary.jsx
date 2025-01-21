import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Terminal Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback p-4 text-red-500 border border-red-500 rounded">
          Something went wrong with the terminal. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
