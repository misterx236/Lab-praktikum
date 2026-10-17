import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TaskPriority } from '../types/task';

interface TaskFormProps {
  onAdd: (title: string, subject: string, priority: TaskPriority) => void;
}

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();

    if (!trimmedTitle || !trimmedSubject) {
      setError('Заполните название задачи и предмет');
      return;
    }

    onAdd(trimmedTitle, trimmedSubject, priority);
    setTitle('');
    setSubject('');
    setPriority('medium');
    setError(null);
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Новая задача</Text>

      <TextInput
        style={styles.input}
        placeholder="Название задачи"
        placeholderTextColor="#9e9e9e"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (error) setError(null);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Предмет"
        placeholderTextColor="#9e9e9e"
        value={subject}
        onChangeText={(text) => {
          setSubject(text);
          if (error) setError(null);
        }}
      />

      <Text style={styles.label}>Приоритет</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => {
          const active = priority === p.value;
          return (
            <Pressable
              key={p.value}
              style={[styles.priorityButton, active && styles.priorityActive]}
              onPress={() => setPriority(p.value)}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  active && styles.priorityButtonTextActive,
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Добавить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212121',
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  label: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 6,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  priorityActive: {
    backgroundColor: '#1565c0',
    borderColor: '#1565c0',
  },
  priorityButtonText: {
    fontSize: 13,
    color: '#424242',
  },
  priorityButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  error: {
    color: '#c62828',
    fontSize: 13,
    marginBottom: 10,
  },
  submit: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});