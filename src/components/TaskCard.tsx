import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task, TaskPriority } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#2e7d32',
  medium: '#ef6c00',
  high: '#c62828',
};

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <View style={[styles.card, task.isCompleted && styles.cardCompleted]}>
      <View style={styles.headerRow}>
        <Text
          style={[styles.title, task.isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: PRIORITY_COLORS[task.priority] },
          ]}
        >
          <Text style={styles.priorityText}>
            {PRIORITY_LABELS[task.priority]}
          </Text>
        </View>
      </View>

      <Text style={styles.subject}>{task.subject}</Text>

      <Text style={styles.status}>
        {task.isCompleted ? '✓ Выполнено' : '○ Активно'}
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.toggleButton]}
          onPress={() => onToggle(task.id)}
        >
          <Text style={styles.buttonText}>
            {task.isCompleted ? 'Вернуть' : 'Выполнить'}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.buttonText}>Удалить</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1565c0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.6,
    borderLeftColor: '#9e9e9e',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#212121',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  priorityBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  subject: {
    marginTop: 6,
    fontSize: 14,
    color: '#616161',
  },
  status: {
    marginTop: 8,
    fontSize: 13,
    color: '#424242',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#1565c0',
  },
  deleteButton: {
    backgroundColor: '#c62828',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});