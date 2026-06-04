import { api } from './client';

export interface NotificationPayload {
  title: string;
  message: string;
  target: 'MUNICIPALITY' | 'ROUTE';
  targetId: string;
}

export interface NotificationResponse {
  id?: string;
  title?: string;
  message?: string;
  sentAt?: string;
  recipientCount: number;
}

export async function sendNotification(payload: NotificationPayload): Promise<NotificationResponse> {
  const r = await api.post('/notifications/send', payload);
  return r.data;
}
