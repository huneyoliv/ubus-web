import { api } from './client';
import { User } from '../stores/auth.store';

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const r = await api.post('/auth/login', { email, password });
  return r.data;
}

export async function register(payload: any): Promise<User> {
  const r = await api.post('/auth/register', payload);
  return r.data;
}
