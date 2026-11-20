import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../../types/task';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../theme/spacing';
import { isOverdue } from '../../utils/task';
import AppButton from '../ui/AppButton';

interface TaskCardProps {
  task: Task;
  onPress: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityLabel: Record<Task['priority'], string> = {
  high: 'высокий',
  medium: 'средний',
  low: 'низкий',
};

export default function TaskCard({
  task,
  onPress,
  onToggle,
  onDelete,
}: TaskCardProps) {
  const { colors } = useTheme();
  const completed = task.status === 'completed';
  const overdue = isOverdue(task);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(task.id)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: completed ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            completed && styles.titleCompleted,
          ]}
        >
          {task.title}
        </Text>
        <Text style={[styles.subject, { color: colors.secondaryText }]}>
          {task.subject}
        </Text>
        <Text style={[styles.priority, { color: colors.secondaryText }]}>
          Приоритет: {priorityLabel[task.priority]}
          {overdue ? ' · просрочена' : ''}
        </Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          title={completed ? 'Вернуть' : 'Готово'}
          variant={completed ? 'secondary' : 'primary'}
          onPress={() => onToggle(task.id)}
          style={styles.actionButton}
        />
        <AppButton
          title="Удалить"
          variant="danger"
          onPress={() => onDelete(task.id)}
          style={styles.actionButton}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    borderWidth: 1,
  },
  info: { marginBottom: spacing.sm + 4 },
  title: { fontSize: 17, fontWeight: '600', marginBottom: spacing.xs },
  titleCompleted: { textDecorationLine: 'line-through', color: '#888' },
  subject: { fontSize: 14, marginBottom: 2 },
  priority: { fontSize: 13 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: { flex: 1 },
});