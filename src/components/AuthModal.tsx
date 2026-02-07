import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        if (formData.password !== formData.password_confirm) {
          setError(t('auth.signup.password_mismatch'));
          setIsLoading(false);
          return;
        }
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password_confirm: formData.password_confirm,
          first_name: formData.first_name,
          last_name: formData.last_name,
        });
      }
      onClose();
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-title">
          {isLogin ? t('auth.login.title') : t('auth.signup.title')}
        </h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">{isLogin ? t('auth.login.username') : t('auth.signup.username')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder={isLogin ? t('auth.login.username_placeholder') : t('auth.signup.username_placeholder')}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="email">{t('auth.signup.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('auth.signup.email_placeholder')}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">{t('auth.signup.first_name')}</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder={t('auth.signup.first_name_placeholder')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">{t('auth.signup.last_name')}</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder={t('auth.signup.last_name_placeholder')}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">{isLogin ? t('auth.login.password') : t('auth.signup.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={isLogin ? t('auth.login.password_placeholder') : t('auth.signup.password_placeholder')}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="password_confirm">{t('auth.signup.password_confirm')}</label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                placeholder={t('auth.signup.password_confirm_placeholder')}
              />
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (isLogin ? t('auth.login.loading') : t('auth.signup.loading')) : (isLogin ? t('auth.login.button') : t('auth.signup.button'))}
          </button>
        </form>

        <div className="google-divider">
          <span>{t('auth.google.divider')}</span>
        </div>

        <button type="button" className="google-button">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t('auth.google.continue')}
        </button>

        <div className="auth-switch">
          {isLogin ? (
            <>
              {t('auth.login.no_account')}{' '}
              <button onClick={() => setIsLogin(false)} className="switch-button">
                {t('auth.login.signup_link')}
              </button>
            </>
          ) : (
            <>
              {t('auth.signup.have_account')}{' '}
              <button onClick={() => setIsLogin(true)} className="switch-button">
                {t('auth.signup.login_link')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
