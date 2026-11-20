import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../theme/spacing';

interface AppInputProps {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
}

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  autoCapitalize = 'sentences',
  maxLength,
}: AppInputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.danger : colors.border,
            color: colors.text,
          },
        ]}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm + 2 },
  label: { fontSize: 14, marginBottom: spacing.xs + 2 },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 10,
    fontSize: 15,
  },
  error: { fontSize: 12, marginTop: spacing.xs },
});