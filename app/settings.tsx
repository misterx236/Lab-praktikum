import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Screen from '../src/components/ui/Screen';
import { useTheme } from '../src/hooks/useTheme';
import { radius, spacing } from '../src/theme/spacing';

export default function SettingsScreen() {
  const { theme, setTheme, colors } = useTheme();

  return (
    <Screen padded>
      <Text style={[styles.heading, { color: colors.text }]}>
        Тема интерфейса
      </Text>

      {(['light', 'dark'] as const).map((mode) => {
        const active = theme === mode;
        return (
          <TouchableOpacity
            key={mode}
            style={[
              styles.option,
              {
                backgroundColor: colors.card,
                borderColor: active ? colors.primary : colors.border,
                borderWidth: active ? 2 : 1,
              },
            ]}
            onPress={() => setTheme(mode)}
          >
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {mode === 'light' ? '☀ Светлая' : '🌙 Тёмная'}
            </Text>
            {active ? (
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                ✓
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm + 4,
  },
});