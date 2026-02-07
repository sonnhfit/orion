import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LandingPage } from '../pages/LandingPage';
import { IoFlashSharp } from 'react-icons/io5';
import '../styles/RootRedirect.css';

export const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <div className="root-redirect-loading">
        <div className="loading-content">
          <div className="loading-logo">
            <IoFlashSharp className="logo-icon pulse" />
          </div>
          <h2 className="loading-title">ORION</h2>
          <div className="loading-spinner">
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // If not logged in, show landing page
  return <LandingPage />;
};
