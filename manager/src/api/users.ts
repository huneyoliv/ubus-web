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
  const { reviewNote, ...rest } = payload;
  const backendPayload = {
    ...rest,
    ...(reviewNote !== undefined ? { note: reviewNote } : {}),
  };
  const r = await api.patch(`/users/${id}/accessibility`, backendPayload);
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

export async function requestVerificationCode(payload: {
  type: 'EMAIL' | 'PHONE' | 'PASSWORD';
  channel: 'EMAIL' | 'WHATSAPP';
  value?: string;
}): Promise<{ message: string; expiresIn: number }> {
  const r = await api.post('/users/me/verification-code', payload);
  return r.data;
}

export async function updateWithVerificationCode(payload: {
  type: 'EMAIL' | 'PHONE' | 'PASSWORD';
  code: string;
  newValue: string;
  currentPassword?: string;
}): Promise<User> {
  const r = await api.put('/users/me/update-with-code', payload);
  return r.data;
}
