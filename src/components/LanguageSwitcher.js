import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => changeLanguage('en')} className="px-3 py-1 border rounded">
        English
      </button>
      <button onClick={() => changeLanguage('es')} className="px-3 py-1 border rounded">
        Español
      </button>
      {/* Add more languages as needed */}
    </div>
  );
};

export default LanguageSwitcher;
