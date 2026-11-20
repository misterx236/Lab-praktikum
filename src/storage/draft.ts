import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskPriority } from '../types/task';

const DRAFT_KEY = '@campus-planner/draft';

export interface TaskDraft {
  title: string;
  subject: string;
  priority: TaskPriority;
}

export async function loadDraft(): Promise<TaskDraft | null> {
  const raw = await AsyncStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.title === 'string' &&
      typeof parsed.subject === 'string' &&
      ['low', 'medium', 'high'].includes(parsed.priority)
    ) {
      return parsed as TaskDraft;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function saveDraft(draft: TaskDraft): Promise<void> {
  await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export async function clearDraft(): Promise<void> {
  await AsyncStorage.removeItem(DRAFT_KEY);
}