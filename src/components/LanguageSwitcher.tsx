import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoGlobeOutline, IoCheckmark } from 'react-icons/io5';
import '../styles/LanguageSwitcher.css';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'en', name: 'English' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <div className="language-switcher">
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change language"
      >
        <IoGlobeOutline className="language-icon" />
        <span className="language-label">{currentLanguage?.name}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span>{lang.name}</span>
              {i18n.language === lang.code && (
                <IoCheckmark className="checkmark-icon" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
