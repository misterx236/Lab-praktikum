import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
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
  isNew?: boolean;
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
  isNew = false,
}: TaskCardProps) {
  const { colors } = useTheme();
  const completed = task.status === 'completed';
  const overdue = isOverdue(task);

  // ── 1. Анимация статуса (withSpring) ──────────────────────
  const statusProgress = useSharedValue(completed ? 1 : 0);

  useEffect(() => {
    statusProgress.value = withSpring(completed ? 1 : 0, {
      damping: 14,
      stiffness: 140,
    });
  }, [completed, statusProgress]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: interpolate(statusProgress.value, [0, 1], [1, 0.65]),
    transform: [
      { scale: interpolate(statusProgress.value, [0, 1], [1, 0.98]) },
    ],
  }));

  const statusIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(statusProgress.value, [0, 1], [1, 1.4]) },
    ],
    backgroundColor: interpolateColor(
      statusProgress.value,
      [0, 1],
      [colors.muted, colors.success]
    ),
  }));

  // ── 2. Раскрытие карточки (withTiming) ────────────────────
  const [expanded, setExpanded] = useState(false);
  const expandProgress = useSharedValue(0);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    expandProgress.value = withTiming(next ? 1 : 0, { duration: 260 });
  };

  const detailsStyle = useAnimatedStyle(() => ({
    opacity: expandProgress.value,
    maxHeight: interpolate(expandProgress.value, [0, 1], [0, 240]),
    marginTop: interpolate(expandProgress.value, [0, 1], [0, spacing.sm]),
    overflow: 'hidden',
  }));

  // ── Доп. задание: появление + подсветка (withSequence) ────
  const enterProgress = useSharedValue(isNew ? 0 : 1);
  const highlight = useSharedValue(0);

  useEffect(() => {
    if (!isNew) return;
    enterProgress.value = withTiming(1, { duration: 260 });
    highlight.value = withSequence(
      withTiming(1, { duration: 220 }),
      withTiming(0, { duration: 500 })
    );
  }, [isNew, enterProgress, highlight]);

  const newCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(enterProgress.value, [0, 1], [16, 0]) },
    ],
    borderColor: interpolateColor(
      highlight.value,
      [0, 1],
      [colors.border, colors.primary]
    ),
    borderWidth: interpolate(highlight.value, [0, 1], [1, 2]),
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: colors.card },
        cardStyle,
        newCardStyle,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(task.id)}
        style={styles.header}
      >
        <Animated.View style={[styles.statusIcon, statusIconStyle]} />

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
      </TouchableOpacity>

      <Animated.View style={detailsStyle}>
        <View style={[styles.details, { borderTopColor: colors.border }]}>
          <Text style={[styles.detailRow, { color: colors.secondaryText }]}>
            Предмет: {task.subject}
          </Text>
          <Text style={[styles.detailRow, { color: colors.secondaryText }]}>
            Создана: {new Date(task.createdAt).toLocaleString()}
          </Text>
          {task.dueDate ? (
            <Text
              style={[
                styles.detailRow,
                { color: overdue ? colors.danger : colors.secondaryText },
              ]}
            >
              Дедлайн: {new Date(task.dueDate).toLocaleString()}
              {overdue ? ' (просрочена)' : ''}
            </Text>
          ) : null}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <AppButton
          title={expanded ? 'Свернуть' : 'Подробнее'}
          variant="secondary"
          onPress={toggleExpanded}
          style={styles.actionButton}
        />
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  statusIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
  },
  info: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', marginBottom: spacing.xs },
  titleCompleted: { textDecorationLine: 'line-through', color: '#888' },
  subject: { fontSize: 14, marginBottom: 2 },
  priority: { fontSize: 13 },
  details: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  detailRow: { fontSize: 13, marginBottom: 2 },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm + 4,
  },
  actionButton: { flex: 1 },
});