import React from 'react';
import '../styles/LoadingSpinner.css';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <p>Đang tải...</p>
      </div>
    </div>
  );
};
