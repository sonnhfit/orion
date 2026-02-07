import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  IoFlashSharp,
  IoBrush,
  IoVideocam,
  IoMic,
  IoSettings,
  IoFolder,
  IoTime,
  IoLink,
  IoPeople,
  IoChevronBack,
  IoChevronForward,
  IoClose,
  IoBrushSharp,
  IoGlobe
} from 'react-icons/io5';
import { CreateMenu } from '../CreateMenu';
import '../../styles/layout/Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isMobile: boolean;
  onToggleSidebar: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobileOpen,
  isMobile,
  onToggleSidebar,
  onCloseMobile
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Navigate to home page without full reload
    navigate('/home');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <IoFlashSharp className="logo-icon" />
          {!isCollapsed && <span className="logo-text">ORION</span>}
        </div>
        <div className="sidebar-header-actions">
          {isMobile && (
            <button className="mobile-close-button" onClick={onCloseMobile} title="Đóng">
              <IoClose />
            </button>
          )}
          {!isMobile && (
            <button className="collapse-button" onClick={onToggleSidebar} title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}>
              {isCollapsed ? <IoChevronForward className="collapse-icon" /> : <IoChevronBack className="collapse-icon" />}
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-content">
        <CreateMenu isCollapsed={isCollapsed} />

        <div className="sidebar-section">
          <Link to="/brand-kit" className="nav-item" title="BrandKit">
            <IoBrushSharp className="nav-icon" />
            {!isCollapsed && <span>BrandKit</span>}
          </Link>
          <Link to="/data-sources" className="nav-item" title="Nguồn dữ liệu">
            <IoGlobe className="nav-icon" />
            {!isCollapsed && <span>Nguồn dữ liệu</span>}
          </Link>
        </div>

        <div className="sidebar-section">
          {!isCollapsed && <h3 className="section-title">Công cụ AI</h3>}
          <a href="#" className="nav-item" title="Thiết kế bằng AI">
            <IoBrush className="nav-icon" />
            {!isCollapsed && <span>Thiết kế bằng AI</span>}
          </a>
          <a href="#" className="nav-item" title="Công cụ tạo video">
            <IoVideocam className="nav-icon" />
            {!isCollapsed && <span>Công cụ tạo video</span>}
          </a>
          <a href="#" className="nav-item" title="Giọng nói AI">
            <IoMic className="nav-icon" />
            {!isCollapsed && <span>Giọng nói AI</span>}
          </a>
          <a href="#" className="nav-item" title="Tất cả công cụ">
            <IoSettings className="nav-icon" />
            {!isCollapsed && <span>Tất cả công cụ</span>}
          </a>
        </div>

        <div className="sidebar-section">
          {!isCollapsed && <h3 className="section-title">Mẫu và dự án</h3>}
          <a href="#" className="nav-item" title="Mẫu">
            <IoFolder className="nav-icon" />
            {!isCollapsed && <span>Mẫu</span>}
          </a>
          <a href="#" className="nav-item" title="Dự án gần đây">
            <IoTime className="nav-icon" />
            {!isCollapsed && <span>Dự án gần đây</span>}
          </a>
          <a href="#" className="nav-item" title="Chia sẻ và lên lịch">
            <IoLink className="nav-icon" />
            {!isCollapsed && <span>Chia sẻ và lên lịch</span>}
          </a>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="username">{user?.username || 'User'}</div>
              <div className="user-status">Không gian mặc định</div>
            </div>
          )}
        </div>
        <button className="nav-item logout-button" onClick={logout} title="Đăng xuất">
          <IoPeople className="nav-icon" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
