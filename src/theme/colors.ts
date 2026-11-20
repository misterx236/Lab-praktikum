export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  inputBg: string;
  primary: string;
  primaryText: string;
  danger: string;
  success: string;
  muted: string;
}

export const lightColors: ThemeColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#111111',
  secondaryText: '#555555',
  border: '#e0e0e0',
  inputBg: '#ffffff',
  primary: '#2196F3',
  primaryText: '#ffffff',
  danger: '#F44336',
  success: '#4CAF50',
  muted: '#848381',
};

export const darkColors: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f0f0f0',
  secondaryText: '#aaaaaa',
  border: '#333333',
  inputBg: '#2a2a2a',
  primary: '#64B5F6',
  primaryText: '#0b0b0b',
  danger: '#EF5350',
  success: '#66BB6A',
  muted: '#555555',
};

export const themes = {
  light: lightColors,
  dark: darkColors,
} as const;