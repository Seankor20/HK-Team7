import { useTheme } from '@/contexts/ThemeContext';

export const useDarkTheme = () => {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  // Common dark theme class combinations
  const darkClasses = {
    // Backgrounds
    bg: isDark ? 'bg-background' : 'bg-background',
    bgCard: isDark ? 'bg-card' : 'bg-card',
    bgMuted: isDark ? 'bg-muted' : 'bg-muted',
    
    // Text colors
    text: isDark ? 'text-foreground' : 'text-foreground',
    textMuted: isDark ? 'text-muted-foreground' : 'text-muted-foreground',
    textPrimary: isDark ? 'text-primary' : 'text-primary',
    
    // Borders
    border: isDark ? 'border-border' : 'border-border',
    
    // Gradients
    gradientBg: isDark ? 'bg-gradient-background' : 'bg-gradient-background',
    gradientPrimary: isDark ? 'bg-gradient-primary' : 'bg-gradient-primary',
    
    // Shadows
    shadow: isDark ? 'shadow-card' : 'shadow-card',
    shadowHover: isDark ? 'hover:shadow-hover' : 'hover:shadow-hover',
    
    // Transitions
    transition: 'transition-all duration-300',
  };
  
  // Conditional classes based on theme
  const conditionalClasses = {
    // Card backgrounds
    cardBg: isDark ? 'bg-card/80 backdrop-blur-sm' : 'bg-card/90 backdrop-blur-sm',
    
    // Hover effects
    hoverBg: isDark ? 'hover:bg-muted/50' : 'hover:bg-muted/30',
    
    // Text emphasis
    textEmphasis: isDark ? 'text-foreground/90' : 'text-foreground/80',
  };
  
  return {
    theme,
    isDark,
    darkClasses,
    conditionalClasses,
    // Helper function to combine classes
    combine: (...classes: (string | undefined | null | false)[]) => 
      classes.filter(Boolean).join(' '),
  };
};
