import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Screen from '../../../src/components/ui/Screen';
import EmptyState from '../../../src/components/ui/EmptyState';
import AppButton from '../../../src/components/ui/AppButton';
import TaskForm from '../../../src/components/task/TaskForm';
import { useTasks } from '../../../src/hooks/useTasks';
import { TaskPriority } from '../../../src/types/task';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, updateTask } = useTasks();
  const task = getTaskById(id);

  if (!task) {
    return (
      <Screen>
        <EmptyState
          icon="❓"
          title="Задача не найдена"
          action={
            <AppButton
              title="Назад"
              onPress={() => router.back()}
              fullWidth={false}
            />
          }
        />
      </Screen>
    );
  }

  const handleSubmit = (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => {
    updateTask(task.id, { title, subject, priority });
    router.back();
  };

  return (
    <Screen scroll>
      <TaskForm
        initialTitle={task.title}
        initialSubject={task.subject}
        initialPriority={task.priority}
        submitLabel="Сохранить"
        onSubmit={handleSubmit}
      />
    </Screen>
  );
}