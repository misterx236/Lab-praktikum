import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../../src/context/AppContext';
import { TaskForm } from '../../../src/components/TaskForm';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, theme } = useApp();
  const isDark = theme === 'dark';
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View style={[styles.center, isDark && styles.darkBg]}>
        <Text style={[styles.notFound, isDark && styles.lightText]}>
          Задача не найдена
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkBg]}>
      <TaskForm
        mode="edit"
        initialValues={{
          title: task.title,
          subject: task.subject,
          priority: task.priority,
        }}
        onSubmit={(title, subject, priority) => {
          updateTask(task.id, { title, subject, priority });
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  darkBg: { backgroundColor: '#121212' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  notFound: { fontSize: 16, color: '#212121' },
  lightText: { color: '#ffffff' },
});