import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import '../styles/LandingPage.css';

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">MKT-RunAgent</span>
          </div>
          <button className="login-button" onClick={() => setIsModalOpen(true)}>
            Đăng nhập
          </button>
        </div>
      </header>

      <main className="landing-main">
        <div className="hero-section">
          <h1 className="hero-title">
            AI Marketing Automation
          </h1>
          <p className="hero-subtitle">
            Xây dựng thương hiệu và bán hàng tự động với sức mạnh AI
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary" onClick={() => setIsModalOpen(true)}>
              Bắt đầu miễn phí
            </button>
            <button className="cta-button secondary">
              Xem demo
            </button>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Phân tích thị trường</h3>
            <p>Crawl và phân tích dữ liệu từ mạng xã hội, diễn đàn, marketplace</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Tìm khách hàng tiềm năng</h3>
            <p>Tự động xác định và chấm điểm lead phù hợp với sản phẩm</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Tạo nội dung AI</h3>
            <p>Tự động tạo bài viết, video script, email marketing</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Nhắn tin tự động</h3>
            <p>Tiếp cận và follow-up khách hàng một cách cá nhân hóa</p>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Người dùng</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1M+</div>
            <div className="stat-label">Lead được tìm</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5M+</div>
            <div className="stat-label">Nội dung tạo ra</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Độ hài lòng</div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>© 2024 MKT-RunAgent. All rights reserved.</p>
      </footer>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
