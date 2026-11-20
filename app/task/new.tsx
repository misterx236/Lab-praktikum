import React from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { TaskForm } from '../../src/components/TaskForm';

export default function NewTaskScreen() {
  const { addTask, theme } = useApp();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      <TaskForm
        mode="create"
        onSubmit={(title, subject, priority) => {
          addTask(title, subject, priority);
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  darkBg: { backgroundColor: '#121212' },
});