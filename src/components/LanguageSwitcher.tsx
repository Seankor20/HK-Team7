import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 h-8 md:h-9 px-2 md:px-3 text-xs md:text-sm bg-transparent hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      <Globe className="h-3 w-3 md:h-4 w-4" />
      <span className="hidden sm:inline">
        {i18n.language === 'en' ? '中文' : 'English'}
      </span>
      <span className="sm:hidden">
        {i18n.language === 'en' ? '中' : 'EN'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
