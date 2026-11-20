import { useContext } from 'react';
import { TasksContext, TasksContextValue } from '../context/TasksContext';

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used inside TasksProvider');
  }
  return ctx;
}