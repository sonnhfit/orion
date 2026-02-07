import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
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
  const { t } = useTranslation();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleLogoClick = () => {
    // Reload landing page
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <IoRocketSharp className="logo-icon" />
            <span className="logo-text">ORION</span>
          </div>
          <nav className="nav-menu">
            <a href="#features" className="nav-link">{t('header.features')}</a>
            <a href="#how-it-works" className="nav-link">{t('header.howItWorks')}</a>
            <a href="#pricing" className="nav-link">{t('header.pricing')}</a>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher />
            <button className="login-button" onClick={() => setIsModalOpen(true)}>
              {t('header.login')}
            </button>
          </div>
        </div>
      </header>

      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <IoSparklesSharp /> {t('hero.badge')}
            </div>
            <h1 className="hero-title">
              {t('hero.titleLine1')}<br />
              {t('hero.titleLine2')}<span className="gradient-text">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('hero.subtitle')}
            </p>
            <div className="hero-buttons">
              <button className="cta-button primary" onClick={() => setIsModalOpen(true)}>
                <span>{t('hero.ctaPrimary')}</span>
                <IoArrowForward />
              </button>
              <button className="cta-button secondary">
                <IoPlayCircle />
                <span>{t('hero.ctaSecondary')}</span>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{t('hero.stats.usersValue')}</div>
                <div className="stat-label">{t('hero.stats.users')}</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">{t('hero.stats.leadsValue')}</div>
                <div className="stat-label">{t('hero.stats.leads')}</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">{t('hero.stats.contentValue')}</div>
                <div className="stat-label">{t('hero.stats.content')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2 className="section-title">{t('features.title')}</h2>
            <p className="section-subtitle">
              {t('features.subtitle')}
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoSearchSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">{t('features.marketAnalysis.title')}</h3>
              <p className="feature-description">
                {t('features.marketAnalysis.description')}
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> {t('features.marketAnalysis.item1')}</li>
                <li><IoCheckmarkCircle /> {t('features.marketAnalysis.item2')}</li>
                <li><IoCheckmarkCircle /> {t('features.marketAnalysis.item3')}</li>
              </ul>
            </div>

            <div className="feature-card featured">
              <div className="featured-badge">{t('features.findLeads.badge')}</div>
              <div className="feature-icon-wrapper">
                <IoLocateSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">{t('features.findLeads.title')}</h3>
              <p className="feature-description">
                {t('features.findLeads.description')}
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> {t('features.findLeads.item1')}</li>
                <li><IoCheckmarkCircle /> {t('features.findLeads.item2')}</li>
                <li><IoCheckmarkCircle /> {t('features.findLeads.item3')}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoSparklesSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">{t('features.contentAI.title')}</h3>
              <p className="feature-description">
                {t('features.contentAI.description')}
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> {t('features.contentAI.item1')}</li>
                <li><IoCheckmarkCircle /> {t('features.contentAI.item2')}</li>
                <li><IoCheckmarkCircle /> {t('features.contentAI.item3')}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoChatbubblesSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">{t('features.outreach.title')}</h3>
              <p className="feature-description">
                {t('features.outreach.description')}
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> {t('features.outreach.item1')}</li>
                <li><IoCheckmarkCircle /> {t('features.outreach.item2')}</li>
                <li><IoCheckmarkCircle /> {t('features.outreach.item3')}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoHardwareChipSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">{t('features.learning.title')}</h3>
              <p className="feature-description">
                {t('features.learning.description')}
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> {t('features.learning.item1')}</li>
                <li><IoCheckmarkCircle /> {t('features.learning.item2')}</li>
                <li><IoCheckmarkCircle /> {t('features.learning.item3')}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <IoTrendingUpSharp className="feature-icon" />
              </div>
              <h3 className="feature-title">{t('features.analytics.title')}</h3>
              <p className="feature-description">
                {t('features.analytics.description')}
              </p>
              <ul className="feature-list">
                <li><IoCheckmarkCircle /> {t('features.analytics.item1')}</li>
                <li><IoCheckmarkCircle /> {t('features.analytics.item2')}</li>
                <li><IoCheckmarkCircle /> {t('features.analytics.item3')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="section-header">
            <h2 className="section-title">{t('howItWorks.title')}</h2>
            <p className="section-subtitle">
              {t('howItWorks.subtitle')}
            </p>
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">{t('howItWorks.step1.title')}</h3>
              <p className="step-description">
                {t('howItWorks.step1.description')}
              </p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">{t('howItWorks.step2.title')}</h3>
              <p className="step-description">
                {t('howItWorks.step2.description')}
              </p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">{t('howItWorks.step3.title')}</h3>
              <p className="step-description">
                {t('howItWorks.step3.description')}
              </p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3 className="step-title">{t('howItWorks.step4.title')}</h3>
              <p className="step-description">
                {t('howItWorks.step4.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section">
          <div className="section-header">
            <h2 className="section-title">{t('pricing.title')}</h2>
            <p className="section-subtitle">
              {t('pricing.subtitle')}
            </p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">{t('pricing.starter.name')}</h3>
                <div className="pricing-price">
                  <span className="price-amount">{t('pricing.starter.price')}</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><IoCheckmarkCircle /> {t('pricing.starter.feature1')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.starter.feature2')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.starter.feature3')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.starter.feature4')}</li>
              </ul>
              <button className="pricing-button" onClick={() => setIsModalOpen(true)}>
                {t('pricing.starter.button')}
              </button>
            </div>

            <div className="pricing-card popular">
              <div className="popular-badge">{t('pricing.professional.badge')}</div>
              <div className="pricing-header">
                <h3 className="pricing-name">{t('pricing.professional.name')}</h3>
                <div className="pricing-price">
                  <span className="price-amount">{t('pricing.professional.price')}</span>
                  <span className="price-period">{t('pricing.professional.period')}</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><IoCheckmarkCircle /> {t('pricing.professional.feature1')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.professional.feature2')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.professional.feature3')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.professional.feature4')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.professional.feature5')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.professional.feature6')}</li>
              </ul>
              <button className="pricing-button primary" onClick={() => setIsModalOpen(true)}>
                {t('pricing.professional.button')}
              </button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">{t('pricing.enterprise.name')}</h3>
                <div className="pricing-price">
                  <span className="price-amount">{t('pricing.enterprise.price')}</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><IoCheckmarkCircle /> {t('pricing.enterprise.feature1')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.enterprise.feature2')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.enterprise.feature3')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.enterprise.feature4')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.enterprise.feature5')}</li>
                <li><IoCheckmarkCircle /> {t('pricing.enterprise.feature6')}</li>
              </ul>
              <button className="pricing-button" onClick={() => setIsModalOpen(true)}>
                {t('pricing.enterprise.button')}
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <IoShieldCheckmarkSharp className="cta-icon" />
            <h2 className="cta-title">{t('cta.title')}</h2>
            <p className="cta-subtitle">
              {t('cta.subtitle')}
            </p>
            <button className="cta-button primary large" onClick={() => setIsModalOpen(true)}>
              <span>{t('cta.button')}</span>
              <IoArrowForward />
            </button>
            <p className="cta-note">{t('cta.note')}</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <IoRocketSharp className="logo-icon" />
              <span className="logo-text">ORION</span>
            </div>
            <p className="footer-description">
              {t('footer.description')}
            </p>
          </div>
          <div className="footer-section">
            <h4>{t('footer.product')}</h4>
            <ul className="footer-links">
              <li><a href="#features">{t('footer.features')}</a></li>
              <li><a href="#pricing">{t('footer.pricing')}</a></li>
              <li><a href="#how-it-works">{t('footer.howItWorks')}</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.support')}</h4>
            <ul className="footer-links">
              <li><a href="#">{t('footer.docs')}</a></li>
              <li><a href="#">{t('footer.api')}</a></li>
              <li><a href="#">{t('footer.contact')}</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.company')}</h4>
            <ul className="footer-links">
              <li><a href="#">{t('footer.about')}</a></li>
              <li><a href="#">{t('footer.blog')}</a></li>
              <li><a href="#">{t('footer.careers')}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
