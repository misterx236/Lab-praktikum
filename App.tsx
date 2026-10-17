import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Task, TaskPriority } from './src/types/task';
import { TaskCard } from './src/components/TaskCard';
import { TaskForm } from './src/components/TaskForm';

type Filter = 'all' | 'active' | 'completed';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Подготовить отчёт по лабораторной',
    subject: 'Физика',
    priority: 'high',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Решить задачи 5.1–5.10',
    subject: 'Математический анализ',
    priority: 'medium',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Прочитать главу 3',
    subject: 'История',
    priority: 'low',
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Написать конспект лекции',
    subject: 'Программирование',
    priority: 'medium',
    isCompleted: true,
  },
];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Выполненные' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<Filter>('all');

  const handleAdd = (title: string, subject: string, priority: TaskPriority) => {
    const newTask: Task = {
      id: String(Date.now()),
      title,
      subject,
      priority,
      isCompleted: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.isCompleted);
    if (filter === 'completed') return tasks.filter((t) => t.isCompleted);
    return tasks;
  }, [tasks, filter]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={handleToggle} onDelete={handleDelete} />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.appTitle}>Планировщик Задач</Text>
              <Text style={styles.stats}>
                Всего: {tasks.length} · Выполнено: {completedCount}
              </Text>
            </View>

            <TaskForm onAdd={handleAdd} />

            <View style={styles.filterRow}>
              {FILTERS.map((f) => {
                const active = filter === f.value;
                return (
                  <Pressable
                    key={f.value}
                    style={[styles.filterButton, active && styles.filterActive]}
                    onPress={() => setFilter(f.value)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Список пока пуст</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1565c0',
  },
  stats: {
    marginTop: 4,
    fontSize: 14,
    color: '#616161',
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: '#1565c0',
    borderColor: '#1565c0',
  },
  filterText: {
    fontSize: 14,
    color: '#424242',
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  empty: {
    paddingTop: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#9e9e9e',
  },
});