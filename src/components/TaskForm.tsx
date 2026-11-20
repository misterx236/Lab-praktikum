import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TaskPriority } from '../types/task';
import { loadDraft, saveDraft, clearDraft } from '../storage/draft';

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

interface Props {
  mode: 'create' | 'edit';
  initialValues?: { title: string; subject: string; priority: TaskPriority };
  onSubmit: (title: string, subject: string, priority: TaskPriority) => void;
}

export function TaskForm({ mode, initialValues, onSubmit }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [subject, setSubject] = useState(initialValues?.subject ?? '');
  const [priority, setPriority] = useState<TaskPriority>(
    initialValues?.priority ?? 'medium'
  );
  const [error, setError] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // В режиме создания пытаемся загрузить черновик
  useEffect(() => {
    if (mode !== 'create' || draftLoaded) return;
    (async () => {
      const draft = await loadDraft();
      if (draft && (draft.title || draft.subject)) {
        Alert.alert('Найден черновик', 'Восстановить введённые ранее данные?', [
          { text: 'Нет', style: 'cancel' },
          {
            text: 'Да',
            onPress: () => {
              setTitle(draft.title);
              setSubject(draft.subject);
              setPriority(draft.priority);
            },
          },
        ]);
      }
      setDraftLoaded(true);
    })();
  }, [mode, draftLoaded]);

  // Автоматическое сохранение черновика (только в режиме создания)
  useEffect(() => {
    if (mode !== 'create') return;
    saveDraft({ title, subject, priority }).catch(() => {});
  }, [mode, title, subject, priority]);

  const handleSubmit = async () => {
    const t = title.trim();
    const s = subject.trim();
    if (!t || !s) {
      setError('Заполните название задачи и предмет');
      return;
    }
    onSubmit(t, s, priority);
    if (mode === 'create') {
      await clearDraft();
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Название задачи"
        placeholderTextColor="#9e9e9e"
        value={title}
        onChangeText={(v) => { setTitle(v); if (error) setError(null); }}
      />
      <TextInput
        style={styles.input}
        placeholder="Предмет"
        placeholderTextColor="#9e9e9e"
        value={subject}
        onChangeText={(v) => { setSubject(v); if (error) setError(null); }}
      />
      <Text style={styles.label}>Приоритет</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => {
          const active = priority === p.value;
          return (
            <Pressable
              key={p.value}
              style={[styles.priorityBtn, active && styles.priorityActive]}
              onPress={() => setPriority(p.value)}
            >
              <Text style={[styles.priorityText, active && styles.priorityTextActive]}>
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>
          {mode === 'create' ? 'Добавить' : 'Сохранить'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  label: { fontSize: 13, color: '#616161', marginBottom: 6 },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  priorityActive: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  priorityText: { fontSize: 13, color: '#424242' },
  priorityTextActive: { color: '#fff', fontWeight: '600' },
  error: { color: '#c62828', fontSize: 13, marginBottom: 10 },
  submit: { backgroundColor: '#2e7d32', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});