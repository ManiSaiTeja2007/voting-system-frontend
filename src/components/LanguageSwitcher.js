import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ lang, setLang }) => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang).catch((err) => console.error('Language change failed:', err));
    setLang(newLang);
  };

  return (
    <div className="absolute top-4 right-4">
      <select
        value={lang}
        onChange={handleChange}
        className="p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
        aria-label="Language Selector"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;