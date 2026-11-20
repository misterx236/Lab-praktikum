import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskPriority } from '../types/task';
import { ThemeMode, loadTheme, saveTheme } from '../storage/theme';

const TASKS_STORAGE_KEY = '@campus-planner/tasks';

interface AppContextValue {
  tasks: Task[];
  theme: ThemeMode;
  addTask: (title: string, subject: string, priority: TaskPriority) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setTheme: (mode: ThemeMode) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [ready, setReady] = useState(false);

  // Инициализация: загрузка темы и задач
  useEffect(() => {
    (async () => {
      try {
        const [savedTheme, savedTasksRaw] = await Promise.all([
          loadTheme(),
          AsyncStorage.getItem(TASKS_STORAGE_KEY),
        ]);
        if (savedTheme) setThemeState(savedTheme);
        if (savedTasksRaw) {
          const parsed = JSON.parse(savedTasksRaw);
          if (Array.isArray(parsed)) setTasks(parsed);
        }
      } catch {
        // fallback
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Сохранение задач
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks, ready]);

  const addTask = useCallback(
    (title: string, subject: string, priority: TaskPriority) => {
      const newTask: Task = {
        id: String(Date.now()),
        title,
        subject,
        priority,
        isCompleted: false,
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    []
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Omit<Task, 'id'>>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    saveTheme(mode).catch(() => {});
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AppContext.Provider
      value={{ tasks, theme, addTask, updateTask, deleteTask, toggleTask, setTheme }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});