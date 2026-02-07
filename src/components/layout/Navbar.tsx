import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  IoChatbubble,
  IoNotifications,
  IoHelpCircle,
  IoMenu
} from 'react-icons/io5';
import { HiCube } from 'react-icons/hi2';
import '../../styles/layout/Navbar.css';

interface NavbarProps {
  isMobile: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isMobile, onToggleMobileMenu }) => {
  const { user } = useAuth();

  return (
    <header className="content-header">
      {isMobile && (
        <button className="hamburger-button" onClick={onToggleMobileMenu} title="Menu">
          <IoMenu />
        </button>
      )}
      <div className="header-actions">
        <button className="upgrade-button">Nâng cấp</button>
        <button className="icon-button mobile-hidden"><IoChatbubble /></button>
        <button className="icon-button mobile-hidden"><HiCube /></button>
        <button className="icon-button"><IoNotifications /></button>
        <button className="icon-button mobile-hidden"><IoHelpCircle /></button>
        <button className="icon-button avatar-button">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </button>
      </div>
    </header>
  );
};
