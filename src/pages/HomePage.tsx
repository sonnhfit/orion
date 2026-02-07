import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/HomePage.css';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="home-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">MKT-RunAgent</span>
          </div>
        </div>

        <button className="create-button">
          <span className="plus-icon">+</span>
          Tạo mới
        </button>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span className="nav-icon">🏠</span>
            Trang chủ
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">✨</span>
            Tạo bằng AI
          </a>
        </nav>

        <div className="sidebar-section">
          <h3 className="section-title">Công cụ AI</h3>
          <a href="#" className="nav-item">
            <span className="nav-icon">🎨</span>
            Thiết kế bằng AI
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🎬</span>
            Công cụ tạo video
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🎤</span>
            Giọng nói AI
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⚙️</span>
            Tất cả công cụ
          </a>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Mẫu và dự án</h3>
          <a href="#" className="nav-item">
            <span className="nav-icon">📁</span>
            Mẫu
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🕐</span>
            Dự án gần đây
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🔗</span>
            Chia sẻ và lên lịch
          </a>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Không gian</h3>
          <div className="user-profile">
            <div className="avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="user-info">
              <div className="username">{user?.username || 'User'}</div>
              <div className="user-status">Không gian mặc định</div>
            </div>
          </div>
          <button className="nav-item" onClick={logout}>
            <span className="nav-icon">👥</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-actions">
            <button className="upgrade-button">Nâng cấp</button>
            <button className="icon-button">💬</button>
            <button className="icon-button">📦</button>
            <button className="icon-button">🔔</button>
            <button className="icon-button">❓</button>
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
                <span className="tab-icon">🎬</span>
                Video
              </button>
              <button className="tab-button">
                <span className="tab-icon">🖼️</span>
                Hình ảnh
              </button>
            </div>
          </section>

          <section className="tools-section">
            <h2 className="section-heading">Có thể bạn muốn thử</h2>
            <div className="tools-grid">
              <div className="tool-card">
                <div className="tool-image">
                  <div className="placeholder-image">📹</div>
                  <button className="add-button">+</button>
                </div>
                <h3 className="tool-title">Video mới</h3>
              </div>

              <div className="tool-card">
                <div className="tool-image">
                  <div className="placeholder-image">🎥</div>
                </div>
                <h3 className="tool-title">Công cụ tạo video bằng AI</h3>
                <span className="badge">Mới</span>
              </div>

              <div className="tool-card">
                <div className="tool-image">
                  <div className="placeholder-image">🎨</div>
                </div>
                <h3 className="tool-title">Phụ đề bằng AI</h3>
                <span className="badge">Mới</span>
              </div>

              <div className="tool-card">
                <div className="tool-image">
                  <div className="placeholder-image">💡</div>
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
                  <span className="template-icon">🎙️</span>
                  <span className="template-label">📻 Podcast</span>
                  <button className="play-button">▶</button>
                  <span className="template-status">Dùng thử ngay</span>
                </div>
              </div>

              <div className="template-card">
                <div className="template-image story">
                  <span className="template-icon">🐱</span>
                  <span className="template-label">📖 Story</span>
                  <button className="play-button">▶</button>
                  <span className="template-status">Dùng thử ngay</span>
                </div>
              </div>

              <div className="template-card">
                <div className="template-image advertisement">
                  <span className="template-icon">☕</span>
                  <span className="template-label">📺 Advertisement</span>
                  <button className="play-button">▶</button>
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
