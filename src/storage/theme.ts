import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = '@campus-planner/theme';

export async function loadTheme(): Promise<ThemeMode | null> {
  const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  return value === 'dark' || value === 'light' ? value : null;
}

export async function saveTheme(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
}