import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task, TaskPriority } from '../types/task';
import { useApp } from '../context/AppContext';

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

interface Props {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}

export function TaskCard({ task, onPress, onToggle }: Props) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        isDark && styles.cardDark,
        task.isCompleted && styles.done,
      ]}
    >
      <View style={styles.row}>
        <Text
          style={[
            styles.title,
            isDark && styles.titleDark,
            task.isCompleted && styles.strike,
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: PRIORITY_COLORS[task.priority] },
          ]}
        >
          <Text style={styles.badgeText}>{PRIORITY_LABELS[task.priority]}</Text>
        </View>
      </View>
      <Text style={[styles.subject, isDark && styles.subjectDark]}>
        {task.subject}
      </Text>
      <Pressable
        onPress={onToggle}
        style={[styles.toggle, isDark && styles.toggleDark]}
      >
        <Text style={[styles.toggleText, isDark && styles.toggleTextDark]}>
          {task.isCompleted ? 'Вернуть в работу' : 'Отметить выполненной'}
        </Text>
      </Pressable>
    </Pressable>
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
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
    borderLeftColor: '#90caf9',
  },
  done: { opacity: 0.6, borderLeftColor: '#9e9e9e' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 17, fontWeight: '600', color: '#212121' },
  titleDark: { color: '#ffffff' },
  strike: { textDecorationLine: 'line-through', color: '#757575' },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  subject: { marginTop: 6, fontSize: 14, color: '#616161' },
  subjectDark: { color: '#b0b0b0' },
  toggle: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleDark: { backgroundColor: '#263238' },
  toggleText: { color: '#1565c0', fontWeight: '600', fontSize: 14 },
  toggleTextDark: { color: '#90caf9' },
});