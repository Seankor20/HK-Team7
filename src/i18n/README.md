# Internationalization (i18n) Setup

This project uses `react-i18next` for internationalization support, currently supporting English and Chinese.

## Structure

```
src/i18n/
├── index.ts              # Main i18n configuration
├── locales/
│   ├── en.json          # English translations
│   └── zh.json          # Chinese translations
└── README.md            # This file
```

## Usage

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('common.welcome')}</h1>;
};
```

### Using the Custom Hook

```tsx
import { useI18n } from '@/hooks/use-i18n';

const MyComponent = () => {
  const { t, currentLanguage, changeLanguage } = useI18n();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>Current language: {currentLanguage}</p>
      <button onClick={() => changeLanguage('zh')}>
        Switch to Chinese
      </button>
    </div>
  );
};
```

### Language Switching

The `LanguageSwitcher` component is automatically included in the navigation and allows users to toggle between English and Chinese.

## Adding New Translations

1. **Add the key to both language files** (`en.json` and `zh.json`)
2. **Use the key in your component** with the `t()` function
3. **Keep the structure consistent** between both files

### Example

```json
// en.json
{
  "newSection": {
    "title": "New Section Title",
    "description": "This is a new section"
  }
}

// zh.json
{
  "newSection": {
    "title": "新章节标题",
    "description": "这是一个新章节"
  }
}
```

```tsx
// In your component
const { t } = useTranslation();
return (
  <div>
    <h2>{t('newSection.title')}</h2>
    <p>{t('newSection.description')}</p>
  </div>
);
```

## Features

- **Automatic language detection** based on browser settings
- **Language persistence** using localStorage
- **Fallback to English** if a translation is missing
- **TypeScript support** with proper typing
- **Easy language switching** with the LanguageSwitcher component

## Available Languages

- **English (en)** - Default language
- **Chinese (zh)** - Traditional Chinese support

## Adding More Languages

To add a new language:

1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json`)
2. Add the language to the resources in `src/i18n/index.ts`
3. Update the `LanguageSwitcher` component to include the new language
4. Add the language option to the `useI18n` hook

## Best Practices

- **Use nested keys** for better organization (e.g., `home.hero.title`)
- **Keep translations consistent** across all language files
- **Use the `t()` function** for all user-facing text
- **Test both languages** to ensure proper display
- **Consider text length** as Chinese text may be longer/shorter than English
