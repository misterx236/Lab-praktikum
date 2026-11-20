import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Screen from '../../src/components/ui/Screen';
import AppButton from '../../src/components/ui/AppButton';
import EmptyState from '../../src/components/ui/EmptyState';
import { useTasks } from '../../src/hooks/useTasks';
import { useTheme } from '../../src/hooks/useTheme';
import { TaskPriority } from '../../src/types/task';
import { isOverdue } from '../../src/utils/task';
import { radius, spacing } from '../../src/theme/spacing';

const priorityLabel: Record<TaskPriority, string> = {
  high: 'высокий',
  medium: 'средний',
  low: 'низкий',
};

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, toggleTaskStatus, removeTask } = useTasks();
  const { colors } = useTheme();
  const task = getTaskById(id);

  if (!task) {
    return (
      <Screen>
        <EmptyState
          icon="❓"
          title="Задача не найдена"
          description="Возможно, она была удалена"
          action={
            <AppButton
              title="К списку"
              onPress={() => router.back()}
              fullWidth={false}
            />
          }
        />
      </Screen>
    );
  }

  const completed = task.status === 'completed';
  const overdue = isOverdue(task);

  return (
    <Screen scroll>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {task.title}
        </Text>
        <Text style={[styles.row, { color: colors.secondaryText }]}>
          Предмет: {task.subject}
        </Text>
        <Text style={[styles.row, { color: colors.secondaryText }]}>
          Приоритет: {priorityLabel[task.priority]}
        </Text>
        <Text style={[styles.row, { color: colors.secondaryText }]}>
          Статус: {completed ? 'выполнена' : 'в работе'}
        </Text>
        <Text style={[styles.row, { color: colors.secondaryText }]}>
          Создана: {new Date(task.createdAt).toLocaleString()}
        </Text>
        {task.dueDate ? (
          <Text
            style={[
              styles.row,
              { color: overdue ? colors.danger : colors.secondaryText },
            ]}
          >
            Дедлайн: {new Date(task.dueDate).toLocaleString()}
            {overdue ? ' (просрочена)' : ''}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <AppButton
          title={completed ? 'Вернуть в работу' : 'Отметить выполненной'}
          variant={completed ? 'secondary' : 'primary'}
          onPress={() => toggleTaskStatus(task.id)}
        />
        <AppButton
          title="Редактировать"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: '/task/edit/[id]',
              params: { id: task.id },
            })
          }
        />
        <AppButton
          title="Удалить"
          variant="danger"
          onPress={() => {
            removeTask(task.id);
            router.back();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm },
  row: { fontSize: 15, marginBottom: spacing.xs },
  actions: { gap: spacing.sm },
});