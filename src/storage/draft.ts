import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskPriority } from '../types/task';

export interface TaskDraft {
  title: string;
  subject: string;
  priority: TaskPriority;
}

const DRAFT_KEY = '@campus-planner/draft';

export async function saveDraft(draft: TaskDraft): Promise<void> {
  try {
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}

export async function loadDraft(): Promise<TaskDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as TaskDraft) : null;
  } catch {
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DRAFT_KEY);
  } catch {}
}