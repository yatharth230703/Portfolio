// ABOUTME: Theme context for managing application themes
// ABOUTME: Provides theme state and switching functionality across components

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'original' | 'light-plus' | 'solarized-dark' | 'dracula' | 'one-dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { name: string; value: Theme; colors: ThemeColors }[];
}

interface ThemeColors {
  background: string;
  sidebar: string;
  primaryAccent: string;
  secondaryAccent: string;
  text: string;
  highlights: {
    red: string;
    brown?: string;
    yellow?: string;
    orange?: string;
    green?: string;
    cyan?: string;
    lavender?: string;
  };
}

const themeDefinitions: Record<Theme, ThemeColors> = {
  'original': {
    background: '#1A1A1A',
    sidebar: '#2D2D2D',
    primaryAccent: '#007ACC',
    secondaryAccent: '#267F99',
    text: '#E0E0E0',
    highlights: {
      red: '#D16969',
      brown: '#795E26'
    }
  },
  'light-plus': {
    background: '#FFFFFF',
    sidebar: '#F3F3F3',
    primaryAccent: '#007ACC',
    secondaryAccent: '#267F99',
    text: '#333333',
    highlights: {
      red: '#D16969',
      brown: '#795E26'
    }
  },
  'solarized-dark': {
    background: '#002B36',
    sidebar: '#073642',
    primaryAccent: '#268BD2',
    secondaryAccent: '#2AA198',
    text: '#EEE8D5',
    highlights: {
      red: '#CB4B16',
      yellow: '#B58900',
      orange: '#CB4B16',
      green: '#859900'
    }
  },
  'dracula': {
    background: '#282A36',
    sidebar: '#1E1F29',
    primaryAccent: '#BD93F9',
    secondaryAccent: '#FF79C6',
    text: '#F8F8F2',
    highlights: {
      red: '#FF5555',
      green: '#50FA7B',
      cyan: '#8BE9FD',
      orange: '#FFB86C'
    }
  },
  'one-dark': {
    background: '#282C34',
    sidebar: '#21252B',
    primaryAccent: '#61AFEF',
    secondaryAccent: '#E06C75',
    text: '#ABB2BF',
    highlights: {
      red: '#E06C75',
      green: '#98C379',
      lavender: '#C678DD'
    }
  }
};

const themeNames: Record<Theme, string> = {
  'original': 'Original',
  'light-plus': 'Light+',
  'solarized-dark': 'Solarized Dark',
  'dracula': 'Dracula',
  'one-dark': 'One Dark'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return (saved as Theme) || 'original';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const colors = themeDefinitions[theme];
    
    // Update CSS variables
    root.style.setProperty('--editor-bg', colors.background);
    root.style.setProperty('--sidebar-bg', colors.sidebar);
    root.style.setProperty('--accent-blue', colors.primaryAccent);
    root.style.setProperty('--text-primary', colors.text);
    root.style.setProperty('--text-secondary', colors.text + '80'); // 50% opacity
    root.style.setProperty('--border-gray', colors.sidebar + '40'); // 25% opacity
    root.style.setProperty('--hover-gray', colors.sidebar + '60'); // 37% opacity
    
    // Set border color based on theme with transparency
    if (theme === 'light-plus') {
      root.style.setProperty('--border-gray', 'rgba(0, 0, 0, 0.3)'); // Semi-transparent black borders for light theme
    } else {
      root.style.setProperty('--border-gray', 'rgba(255, 255, 255, 0.3)'); // Semi-transparent white borders for all other themes
    }
    
    // Update highlight colors
    root.style.setProperty('--warning-orange', colors.highlights.red);
    root.style.setProperty('--success-green', colors.highlights.green || colors.highlights.cyan || colors.highlights.lavender || colors.secondaryAccent);
    
    // Update secondary accent for specific themes
    if (colors.highlights.cyan) {
      root.style.setProperty('--accent-cyan', colors.highlights.cyan);
    }
    if (colors.highlights.lavender) {
      root.style.setProperty('--accent-purple', colors.highlights.lavender);
    }
  }, [theme]);

  const themes = Object.entries(themeNames).map(([value, name]) => ({
    name,
    value: value as Theme,
    colors: themeDefinitions[value as Theme]
  }));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
