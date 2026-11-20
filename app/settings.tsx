import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../src/context/AppContext';

export default function SettingsScreen() {
  const { theme, setTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.darkBg]}>
      <Text style={[styles.heading, isDark && styles.lightText]}>
        Настройки
      </Text>
      <Text style={[styles.label, isDark && styles.lightSubtext]}>
        Тема оформления
      </Text>

      <Pressable
        style={[styles.option, !isDark && styles.optionActive]}
        onPress={() => setTheme('light')}
      >
        <Text style={[styles.optionText, !isDark && styles.optionTextActive]}>
          Светлая
        </Text>
      </Pressable>

      <Pressable
        style={[styles.option, isDark && styles.optionActive]}
        onPress={() => setTheme('dark')}
      >
        <Text style={[styles.optionText, isDark && styles.optionTextActive]}>
          Тёмная
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f2f5' },
  darkBg: { backgroundColor: '#121212' },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 24, color: '#212121' },
  lightText: { color: '#fff' },
  label: { fontSize: 14, color: '#616161', marginBottom: 10 },
  lightSubtext: { color: '#b0b0b0' },
  option: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  optionActive: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  optionText: { fontSize: 16, color: '#424242' },
  optionTextActive: { color: '#fff', fontWeight: '600' },
});