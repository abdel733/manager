const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export type ApiUser = { id: string; firstName: string; lastName: string; email: string; role: 'ADMIN' | 'MEMBER' };
export type ApiComment = { id: string; content: string; user: Pick<ApiUser, 'firstName' | 'lastName'>; createdAt: string };

export type ApiTask = {
  id: string;
  title: string;
  description?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  startDate: string;
  endDate: string;
  assignments?: { user?: ApiUser }[];
  comments?: ApiComment[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) }, cache: 'no-store' });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message ?? 'Erreur de communication avec le serveur');
  return response.json();
}

export const api = {
  login: (email: string, password: string) => request<{ accessToken: string; user: ApiUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  users: () => request<ApiUser[]>('/users'),
  tasks: (userId?: string) => request<ApiTask[]>(`/tasks${userId ? `?userId=${userId}` : ''}`),
  task: (id: string) => request<ApiTask>(`/tasks/${id}`),
  createTask: (payload: { title: string; description?: string; startDate: string; endDate: string; creatorId: string; assigneeIds: string[] }) => request<ApiTask>('/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (id: string, payload: { title?: string; description?: string; startDate?: string; endDate?: string; assigneeIds?: string[] }) => request<ApiTask>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTask: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),
  updateStatus: (id: string, status: string, userId: string) => request<ApiTask>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, userId }) }),
  addComment: (id: string, userId: string, content: string) => request<ApiComment>(`/tasks/${id}/comments`, { method: 'POST', body: JSON.stringify({ userId, content }) }),
  summary: () => request<{ total: number; status: Record<string, number>; users: { id: string; name: string; counts: Record<string, number> }[] }>('/dashboard/summary'),
};
