import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../src/context/AppContext';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, toggleTask, deleteTask, theme } = useApp();
  const isDark = theme === 'dark';
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View style={[styles.center, isDark && styles.darkBg]}>
        <Text style={[styles.notFound, isDark && styles.lightText]}>
          Задача не найдена
        </Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Вернуться к списку</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, isDark && styles.darkBg]}
    >
      <Text style={[styles.title, isDark && styles.lightText]}>
        {task.title}
      </Text>
      <Text style={[styles.subject, isDark && styles.lightSubtext]}>
        Предмет: {task.subject}
      </Text>
      <Text style={[styles.priority, isDark && styles.lightSubtext]}>
        Приоритет: {task.priority}
      </Text>
      <Text style={[styles.status, isDark && styles.lightSubtext]}>
        Статус: {task.isCompleted ? 'Выполнено' : 'Активно'}
      </Text>

      <Pressable
        style={[styles.toggleBtn, isDark && styles.toggleBtnDark]}
        onPress={() => toggleTask(task.id)}
      >
        <Text style={[styles.toggleText, isDark && styles.toggleTextDark]}>
          {task.isCompleted ? 'Вернуть в работу' : 'Отметить выполненной'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.editBtn}
        onPress={() =>
          router.push({ pathname: '/task/edit/[id]', params: { id: task.id } })
        }
      >
        <Text style={styles.editText}>Редактировать</Text>
      </Pressable>

      <Pressable
        style={[styles.deleteBtn, isDark && styles.deleteBtnDark]}
        onPress={() => {
          deleteTask(task.id);
          router.back();
        }}
      >
        <Text style={[styles.deleteText, isDark && styles.deleteTextDark]}>
          Удалить
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f0f2f5',
  },
  darkBg: { backgroundColor: '#121212' },
  notFound: { fontSize: 18, marginBottom: 16, color: '#212121' },
  lightText: { color: '#ffffff' },
  lightSubtext: { color: '#b0b0b0' },
  backBtn: {
    backgroundColor: '#1565c0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backText: { color: '#fff', fontWeight: '600' },
  container: {
    padding: 16,
    backgroundColor: '#f0f2f5',
    flexGrow: 1,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12, color: '#212121' },
  subject: { fontSize: 16, color: '#424242', marginBottom: 6 },
  priority: { fontSize: 16, color: '#424242', marginBottom: 6 },
  status: { fontSize: 16, color: '#424242', marginBottom: 20 },
  toggleBtn: {
    backgroundColor: '#e3f2fd',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleBtnDark: { backgroundColor: '#263238' },
  toggleText: { color: '#1565c0', fontWeight: '600' },
  toggleTextDark: { color: '#90caf9' },
  editBtn: {
    backgroundColor: '#1565c0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  editText: { color: '#fff', fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#ffebee',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnDark: { backgroundColor: '#3a1f1f' },
  deleteText: { color: '#c62828', fontWeight: '600' },
  deleteTextDark: { color: '#ef9a9a' },
});