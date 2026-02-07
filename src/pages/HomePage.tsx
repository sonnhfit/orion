import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/HomePage.css';
import { 
  IoFlashSharp, 
  IoHomeSharp, 
  IoSparkles, 
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
  IoAdd,
  IoChatbubble,
  IoNotifications,
  IoHelpCircle,
  IoPlay,
  IoFilm,
  IoImage,
  IoBulb,
  IoRadio,
  IoBook,
  IoTv,
  IoMenu,
  IoClose
} from 'react-icons/io5';
import { HiCube } from 'react-icons/hi2';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="home-page">
      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobile && isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <IoFlashSharp className="logo-icon" />
            {!isSidebarCollapsed && <span className="logo-text">ORION</span>}
          </div>
          <div className="sidebar-header-actions">
            {isMobile && (
              <button className="mobile-close-button" onClick={closeMobileMenu} title="Đóng">
                <IoClose />
              </button>
            )}
            {!isMobile && (
              <button className="collapse-button" onClick={toggleSidebar} title={isSidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}>
                {isSidebarCollapsed ? <IoChevronForward className="collapse-icon" /> : <IoChevronBack className="collapse-icon" />}
              </button>
            )}
          </div>
        </div>

        <div className="sidebar-content">
          <button className="create-button">
            <IoAdd className="plus-icon" />
            {!isSidebarCollapsed && <span>Tạo mới</span>}
          </button>

          <nav className="sidebar-nav">
            <a href="#" className="nav-item active" title="Trang chủ">
              <IoHomeSharp className="nav-icon" />
              {!isSidebarCollapsed && <span>Trang chủ</span>}
            </a>
            <a href="#" className="nav-item" title="Tạo bằng AI">
              <IoSparkles className="nav-icon" />
              {!isSidebarCollapsed && <span>Tạo bằng AI</span>}
            </a>
          </nav>

          <div className="sidebar-section">
            {!isSidebarCollapsed && <h3 className="section-title">Công cụ AI</h3>}
            <a href="#" className="nav-item" title="Thiết kế bằng AI">
              <IoBrush className="nav-icon" />
              {!isSidebarCollapsed && <span>Thiết kế bằng AI</span>}
            </a>
            <a href="#" className="nav-item" title="Công cụ tạo video">
              <IoVideocam className="nav-icon" />
              {!isSidebarCollapsed && <span>Công cụ tạo video</span>}
            </a>
            <a href="#" className="nav-item" title="Giọng nói AI">
              <IoMic className="nav-icon" />
              {!isSidebarCollapsed && <span>Giọng nói AI</span>}
            </a>
            <a href="#" className="nav-item" title="Tất cả công cụ">
              <IoSettings className="nav-icon" />
              {!isSidebarCollapsed && <span>Tất cả công cụ</span>}
            </a>
          </div>

          <div className="sidebar-section">
            {!isSidebarCollapsed && <h3 className="section-title">Mẫu và dự án</h3>}
            <a href="#" className="nav-item" title="Mẫu">
              <IoFolder className="nav-icon" />
              {!isSidebarCollapsed && <span>Mẫu</span>}
            </a>
            <a href="#" className="nav-item" title="Dự án gần đây">
              <IoTime className="nav-icon" />
              {!isSidebarCollapsed && <span>Dự án gần đây</span>}
            </a>
            <a href="#" className="nav-item" title="Chia sẻ và lên lịch">
              <IoLink className="nav-icon" />
              {!isSidebarCollapsed && <span>Chia sẻ và lên lịch</span>}
            </a>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
            {!isSidebarCollapsed && (
              <div className="user-info">
                <div className="username">{user?.username || 'User'}</div>
                <div className="user-status">Không gian mặc định</div>
              </div>
            )}
          </div>
          <button className="nav-item logout-button" onClick={logout} title="Đăng xuất">
            <IoPeople className="nav-icon" />
            {!isSidebarCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          {isMobile && (
            <button className="hamburger-button" onClick={toggleMobileMenu} title="Menu">
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

        <div className="content-body">
          <section className="hero-banner">
            <h1 className="banner-title">Tạo bất cứ thứ gì bằng AI theo cách của bạn</h1>
            <p className="banner-subtitle">
              Bạn có thể tùy chọn tạo từ đầu, sử dụng mẫu có sẵn hoặc một số công cụ AI thần thánh.
            </p>
            <div className="content-tabs">
              <button className="tab-button active">
                <IoFilm className="tab-icon" />
                Video
              </button>
              <button className="tab-button">
                <IoImage className="tab-icon" />
                Hình ảnh
              </button>
            </div>
          </section>

          <section className="tools-section">
            <h2 className="section-heading">Có thể bạn muốn thử</h2>
            <div className="tools-grid">
              <div className="tool-card">
                <div className="tool-image">
                  <div className="placeholder-image"><IoVideocam /></div>
                  <button className="add-button"><IoAdd /></button>
                </div>
                <h3 className="tool-title">Video mới</h3>
              </div>

              <div className="tool-card">
                <div className="tool-image">
                  <div className="placeholder-image"><IoFilm /></div>
                </div>
                <h3 className="tool-title">Công cụ tạo video bằng AI</h3>
                <span className="badge">Mới</span>
              </div>

              <div className="tool-card">
                <div className="tool-image">
                  <div className="placeholder-image"><IoBrush /></div>
                </div>
                <h3 className="tool-title">Phụ đề bằng AI</h3>
                <span className="badge">Mới</span>
              </div>

              <div className="tool-card">
                <div className="tool-image">
                  <div className="placeholder-image"><IoBulb /></div>
                </div>
                <h3 className="tool-title">Lên ý tưởng cùng AI</h3>
                <span className="badge">Mới</span>
              </div>
            </div>
          </section>

          <section className="templates-section">
            <h2 className="section-heading">Tạo giọng lồng tiếng bằng AI từ văn bản hoặc âm thanh</h2>
            <div className="templates-grid">
              <div className="template-card">
                <div className="template-image podcast">
                  <IoMic className="template-icon" />
                  <span className="template-label"><IoRadio /> Podcast</span>
                  <button className="play-button"><IoPlay /></button>
                  <span className="template-status">Dùng thử ngay</span>
                </div>
              </div>

              <div className="template-card">
                <div className="template-image story">
                  <IoBook className="template-icon" />
                  <span className="template-label"><IoBook /> Story</span>
                  <button className="play-button"><IoPlay /></button>
                  <span className="template-status">Dùng thử ngay</span>
                </div>
              </div>

              <div className="template-card">
                <div className="template-image advertisement">
                  <IoTv className="template-icon" />
                  <span className="template-label"><IoTv /> Advertisement</span>
                  <button className="play-button"><IoPlay /></button>
                  <span className="template-status">Dùng thử ngay</span>
                </div>
              </div>
            </div>
          </section>

          <section className="ai-templates-section">
            <h2 className="section-heading">Sáng tạo đơn giản hơn với mẫu do AI tạo</h2>
            <div className="template-tabs">
              <button className="template-tab active">Mẫu mới</button>
              <button className="template-tab">Câu chuyện hư cấu</button>
              <button className="template-tab">Sự thật bạn chưa biết</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
