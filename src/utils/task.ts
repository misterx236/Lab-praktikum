import {
  Task,
  TaskPriority,
  TaskStats,
  TaskStatus,
} from '../types/task';

const priorityWeight: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function getTaskStats(tasks: Task[]): TaskStats {
  let active = 0;
  let completed = 0;
  for (const t of tasks) {
    if (t.status === 'completed') completed++;
    else active++;
  }
  return { total: tasks.length, active, completed };
}

export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
  );
}

export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((t) => t.status === status);
}

export function isOverdue(task: Task, now: Date = new Date()): boolean {
  if (!task.dueDate) return false;
  if (task.status === 'completed') return false;
  return new Date(task.dueDate).getTime() < now.getTime();
}

export function filterTasks(tasks: Task[], query: string): Task[] {
  const q = query.trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
  );
}