import type { ApiComment, ApiUser } from '@/lib/api';

export type Status = 'En attente' | 'En cours' | 'Terminé' | 'En retard';

export type Task = {
  id: string | number;
  title: string;
  description: string;
  project: string;
  assignee: string;
  assignees: ApiUser[];
  initials: string;
  status: Status;
  due: string;
  dueLabel: string;
  priority: string;
  color: string;
  comments: ApiComment[];
};

export type TaskForm = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assigneeIds: string[];
};
