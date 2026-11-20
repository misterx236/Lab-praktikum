import React, { createContext, useCallback, useMemo, useState } from 'react';
import {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../types/task';

export interface TasksContextValue {
  tasks: Task[];
  createTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  removeTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const TasksContext = createContext<TasksContextValue | undefined>(
  undefined
);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const createTask = useCallback((input: CreateTaskInput): Task => {
    const task: Task = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      status: 'active',
      ...input,
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...input } : t))
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'active' ? 'completed' : 'active',
            }
          : t
      )
    );
  }, []);

  const value = useMemo<TasksContextValue>(() => {
    const getTaskById = (id: string) => tasks.find((t) => t.id === id);
    return {
      tasks,
      createTask,
      updateTask,
      removeTask,
      toggleTaskStatus,
      getTaskById,
    };
  }, [tasks, createTask, updateTask, removeTask, toggleTaskStatus]);

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}