import { api } from './client';
import { User } from '../stores/auth.store';

export async function listUsers(params: {
  role?: string;
  status?: string;
  accessibilityStatus?: string;
  municipalityId?: string;
}): Promise<User[]> {
  const r = await api.get('/users', { params });
  return r.data;
}

export async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<User> {
  const r = await api.patch(`/users/${id}/status`, { status });
  return r.data;
}

export async function reviewAccessibility(
  id: string,
  payload: { status: 'APPROVED' | 'REJECTED'; reviewNote?: string }
): Promise<User> {
  const r = await api.patch(`/users/${id}/accessibility-review`, payload);
  return r.data;
}

export async function getMe(): Promise<User> {
  const r = await api.get('/users/me');
  return r.data;
}

export async function updateMe(payload: { phone?: string; email?: string }): Promise<User> {
  const r = await api.patch('/users/me', payload);
  return r.data;
}
