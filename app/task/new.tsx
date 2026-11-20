import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Screen from '../../src/components/ui/Screen';
import TaskForm from '../../src/components/task/TaskForm';
import { useTasks } from '../../src/hooks/useTasks';
import { useTheme } from '../../src/hooks/useTheme';
import { TaskPriority } from '../../src/types/task';
import {
  clearDraft,
  loadDraft,
  saveDraft,
} from '../../src/storage/draft';
import { spacing } from '../../src/theme/spacing';

interface InitialState {
  title: string;
  subject: string;
  priority: TaskPriority;
}

export default function NewTaskScreen() {
  const { createTask } = useTasks();
  const { colors } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [initial, setInitial] = useState<InitialState>({
    title: '',
    subject: '',
    priority: 'medium',
  });

  useEffect(() => {
    (async () => {
      const draft = await loadDraft();
      if (draft && (draft.title.trim() || draft.subject.trim())) {
        Alert.alert('Найден черновик', 'Восстановить сохранённый черновик?', [
          {
            text: 'Нет',
            style: 'cancel',
            onPress: async () => {
              await clearDraft();
              setLoaded(true);
            },
          },
          {
            text: 'Да',
            onPress: () => {
              setInitial(draft);
              setLoaded(true);
            },
          },
        ]);
      } else {
        setLoaded(true);
      }
    })();
  }, []);

  const handleDraftChange = useCallback(
    (title: string, subject: string, priority: TaskPriority) => {
      if (!loaded) return;
      if (!title.trim() && !subject.trim()) {
        clearDraft();
        return;
      }
      saveDraft({ title, subject, priority });
    },
    [loaded]
  );

  const handleSubmit = (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => {
    createTask({ title, subject, priority });
    clearDraft();
    router.back();
  };

  if (!loaded) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={{ color: colors.text }}>Загрузка…</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <TaskForm
        initialTitle={initial.title}
        initialSubject={initial.subject}
        initialPriority={initial.priority}
        submitLabel="Добавить"
        onSubmit={handleSubmit}
        onDraftChange={handleDraftChange}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
});