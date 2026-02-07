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
