import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemeColors, themes } from '../theme/colors';
import { ThemeMode, loadTheme, saveTheme } from '../storage/theme';

export interface ThemeContextValue {
  theme: ThemeMode;
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await loadTheme();
      setThemeState(saved);
      setReady(true);
    })();
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    saveTheme(mode);
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ThemeContext.Provider
      value={{ theme, colors: themes[theme], setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}