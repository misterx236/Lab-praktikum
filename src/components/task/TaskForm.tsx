import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TaskPriority } from '../../types/task';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../theme/spacing';
import AppButton from '../ui/AppButton';
import AppInput from '../ui/AppInput';

interface TaskFormProps {
  initialTitle?: string;
  initialSubject?: string;
  initialPriority?: TaskPriority;
  submitLabel: string;
  onSubmit: (title: string, subject: string, priority: TaskPriority) => void;
  onDraftChange?: (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => void;
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export default function TaskForm({
  initialTitle = '',
  initialSubject = '',
  initialPriority = 'medium',
  submitLabel,
  onSubmit,
  onDraftChange,
}: TaskFormProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [subject, setSubject] = useState(initialSubject);
  const [priority, setPriority] = useState<TaskPriority>(initialPriority);
  const [errors, setErrors] = useState<{ title?: string; subject?: string }>(
    {}
  );

  useEffect(() => {
    setTitle(initialTitle);
    setSubject(initialSubject);
    setPriority(initialPriority);
  }, [initialTitle, initialSubject, initialPriority]);

  useEffect(() => {
    if (onDraftChange) onDraftChange(title, subject, priority);
  }, [title, subject, priority, onDraftChange]);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();
    const next: { title?: string; subject?: string } = {};
    if (!trimmedTitle) next.title = 'Введите название';
    if (!trimmedSubject) next.subject = 'Введите предмет';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit(trimmedTitle, trimmedSubject, priority);
  };

  return (
    <View
      style={[
        styles.form,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <AppInput
        label="Название задачи"
        value={title}
        onChangeText={(v) => {
          setTitle(v);
          if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
        }}
        placeholder="Например, конспект по матанализу"
        error={errors.title}
      />
      <AppInput
        label="Предмет"
        value={subject}
        onChangeText={(v) => {
          setSubject(v);
          if (errors.subject)
            setErrors((e) => ({ ...e, subject: undefined }));
        }}
        placeholder="Например, Математика"
        error={errors.subject}
      />

      <Text style={[styles.label, { color: colors.secondaryText }]}>
        Приоритет
      </Text>
      <View style={styles.priorityRow}>
        {priorities.map((p) => {
          const active = priority === p.value;
          return (
            <TouchableOpacity
              key={p.value}
              style={[
                styles.priorityButton,
                {
                  borderColor: active ? colors.primary : colors.border,
                  backgroundColor: active ? colors.primary : 'transparent',
                },
              ]}
              onPress={() => setPriority(p.value)}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: active ? colors.primaryText : colors.text },
                  active && styles.priorityActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <AppButton title={submitLabel} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  label: { fontSize: 14, marginBottom: spacing.xs + 2 },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityText: { fontSize: 13 },
  priorityActive: { fontWeight: '600' },
});