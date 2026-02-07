import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { 
  IoRocketSharp,
  IoSearchSharp,
  IoLocateSharp,
  IoSparklesSharp,
  IoChatbubblesSharp,
  IoHardwareChipSharp,
  IoTrendingUpSharp,
  IoShieldCheckmarkSharp,
  IoCheckmarkCircle,
  IoArrowForward,
  IoPlayCircle
} from 'react-icons/io5';
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
            <IoRocketSharp className="logo-icon" />
            <span className="logo-text">ORION</span>
          </div>
          <nav className="nav-menu">
            <a href="#features" className="nav-link">Tính năng</a>
            <a href="#how-it-works" className="nav-link">Cách hoạt động</a>
            <a href="#pricing" className="nav-link">Bảng giá</a>
          </nav>
          <button className="login-button" onClick={() => setIsModalOpen(true)}>
            Đăng nhập
          </button>
        </div>
      </header>

      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <IoSparklesSharp /> AI Marketing Automation Platform
            </div>
            <h1 className="hero-title">
              Xây dựng thương hiệu và<br />
              bán hàng tự động với <span className="gradient-text">AI</span>
            </h1>
            <p className="hero-subtitle">
              ORION giúp bạn tìm kiếm khách hàng tiềm năng, tạo nội dung chuyên nghiệp,
              và tự động hóa chiến dịch marketing - tất cả bằng sức mạnh AI
            </p>
            <div className="hero-buttons">
              <button className="cta-button primary" onClick={() => setIsModalOpen(true)}>
                <span>Bắt đầu miễn phí</span>
                <IoArrowForward />
              </button>
              <button className="cta-button secondary">
                <IoPlayCircle />
                <span>Xem Demo</span>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Người dùng</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Lead tìm được</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">5M+</div>
                <div className="stat-label">Nội dung tạo</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2 className="section-title">Tính năng nổi bật</h2>
            <p className="section-subtitle">
              Một nền tảng hoàn chỉnh để tự động hóa toàn bộ quy trình marketing của bạn
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoSearchSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">Phân tích thị trường thông minh</h3>
              <p className="feature-description">
                Crawl và phân tích dữ liệu từ mạng xã hội, diễn đàn, marketplace để 
                hiểu rõ nhu cầu thị trường và xu hướng.
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> Thu thập dữ liệu tự động</li>
                <li><IoCheckmarkCircle /> Phân tích insight khách hàng</li>
                <li><IoCheckmarkCircle /> Theo dõi đối thủ</li>
              </ul>
            </div>

            <div className="feature-card featured">
              <div className="featured-badge">Phổ biến nhất</div>
              <div className="feature-icon-wrapper">
                <IoLocateSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">Tìm khách hàng tiềm năng</h3>
              <p className="feature-description">
                AI tự động tìm kiếm, chấm điểm và phân loại khách hàng phù hợp 
                với sản phẩm/dịch vụ của bạn.
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> Tìm lead chất lượng cao</li>
                <li><IoCheckmarkCircle /> Chấm điểm tự động</li>
                <li><IoCheckmarkCircle /> Phân loại theo nhóm</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoSparklesSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">Tạo nội dung AI</h3>
              <p className="feature-description">
                Tự động tạo bài viết, video script, email marketing và landing page 
                chuyên nghiệp với AI.
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> Nội dung cá nhân hóa</li>
                <li><IoCheckmarkCircle /> Đa nền tảng</li>
                <li><IoCheckmarkCircle /> Tối ưu SEO</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoChatbubblesSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">Outreach tự động</h3>
              <p className="feature-description">
                Tiếp cận và follow-up khách hàng tự động với tin nhắn được cá nhân hóa 
                bởi AI.
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> Nhắn tin tự động</li>
                <li><IoCheckmarkCircle /> Follow-up thông minh</li>
                <li><IoCheckmarkCircle /> Tránh spam</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoHardwareChipSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">Học và tối ưu liên tục</h3>
              <p className="feature-description">
                Hệ thống học từ mỗi tương tác để cải thiện chiến lược và 
                tăng tỷ lệ chuyển đổi.
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> Machine Learning</li>
                <li><IoCheckmarkCircle /> A/B Testing tự động</li>
                <li><IoCheckmarkCircle /> Tối ưu ROI</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoTrendingUpSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">Analytics & Reporting</h3>
              <p className="feature-description">
                Dashboard trực quan với các chỉ số quan trọng để theo dõi 
                hiệu quả chiến dịch.
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> Báo cáo chi tiết</li>
                <li><IoCheckmarkCircle /> Real-time tracking</li>
                <li><IoCheckmarkCircle /> Export dữ liệu</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="section-header">
            <h2 className="section-title">Cách hoạt động</h2>
            <p className="section-subtitle">
              Quy trình tự động 4 bước để đưa doanh nghiệp của bạn lên tầm cao mới
            </p>
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Thu thập dữ liệu</h3>
              <p className="step-description">
                AI crawl và phân tích dữ liệu từ nhiều nguồn để hiểu thị trường và khách hàng
              </p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Xác định cơ hội</h3>
              <p className="step-description">
                Tìm và chấm điểm khách hàng tiềm năng, xây dựng chiến lược tiếp cận
              </p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Tạo & triển khai</h3>
              <p className="step-description">
                AI tạo nội dung và tự động tiếp cận khách hàng với tin nhắn cá nhân hóa
              </p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3 className="step-title">Học & tối ưu</h3>
              <p className="step-description">
                Học từ kết quả và liên tục cải thiện để tăng tỷ lệ chuyển đổi
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section">
          <div className="section-header">
            <h2 className="section-title">Bảng giá phù hợp với mọi quy mô</h2>
            <p className="section-subtitle">
              Chọn gói phù hợp với nhu cầu của bạn, nâng cấp bất cứ lúc nào
            </p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Starter</h3>
                <div className="pricing-price">
                  <span className="price-amount">Miễn phí</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><IoCheckmarkCircle /> 100 lead/tháng</li>
                <li><IoCheckmarkCircle /> 1 thương hiệu</li>
                <li><IoCheckmarkCircle /> Tạo nội dung cơ bản</li>
                <li><IoCheckmarkCircle /> Community support</li>
              </ul>
              <button className="pricing-button" onClick={() => setIsModalOpen(true)}>
                Bắt đầu ngay
              </button>
            </div>

            <div className="pricing-card popular">
              <div className="popular-badge">Phổ biến nhất</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Professional</h3>
                <div className="pricing-price">
                  <span className="price-amount">499K</span>
                  <span className="price-period">/tháng</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><IoCheckmarkCircle /> 5,000 lead/tháng</li>
                <li><IoCheckmarkCircle /> 5 thương hiệu</li>
                <li><IoCheckmarkCircle /> AI content advanced</li>
                <li><IoCheckmarkCircle /> Auto outreach</li>
                <li><IoCheckmarkCircle /> Analytics & Reports</li>
                <li><IoCheckmarkCircle /> Priority support</li>
              </ul>
              <button className="pricing-button primary" onClick={() => setIsModalOpen(true)}>
                Dùng thử 14 ngày
              </button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Enterprise</h3>
                <div className="pricing-price">
                  <span className="price-amount">Liên hệ</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><IoCheckmarkCircle /> Không giới hạn lead</li>
                <li><IoCheckmarkCircle /> Không giới hạn thương hiệu</li>
                <li><IoCheckmarkCircle /> Custom AI model</li>
                <li><IoCheckmarkCircle /> White-label</li>
                <li><IoCheckmarkCircle /> Dedicated support</li>
                <li><IoCheckmarkCircle /> SLA guarantee</li>
              </ul>
              <button className="pricing-button" onClick={() => setIsModalOpen(true)}>
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <IoShieldCheckmarkSharp className="cta-icon" />
            <h2 className="cta-title">Sẵn sàng tăng tốc doanh nghiệp của bạn?</h2>
            <p className="cta-subtitle">
              Tham gia cùng hàng nghìn doanh nghiệp đang sử dụng ORION để phát triển
            </p>
            <button className="cta-button primary large" onClick={() => setIsModalOpen(true)}>
              <span>Bắt đầu miễn phí ngay hôm nay</span>
              <IoArrowForward />
            </button>
            <p className="cta-note">Không cần thẻ tín dụng • Hủy bất cứ lúc nào</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <IoRocketSharp className="logo-icon" />
              <span className="logo-text">ORION</span>
            </div>
            <p className="footer-description">
              Nền tảng AI Marketing Automation hàng đầu Việt Nam
            </p>
          </div>
          <div className="footer-section">
            <h4>Sản phẩm</h4>
            <ul className="footer-links">
              <li><a href="#features">Tính năng</a></li>
              <li><a href="#pricing">Bảng giá</a></li>
              <li><a href="#how-it-works">Cách hoạt động</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              <li><a href="#">Tài liệu</a></li>
              <li><a href="#">API</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Công ty</h4>
            <ul className="footer-links">
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Orion. All rights reserved.</p>
        </div>
      </footer>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
