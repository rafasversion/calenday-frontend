import { fetchApi } from './api';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message?: string;
  is_read: boolean;
  created_at: string;
  event_id?: number;
}

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const response = await fetchApi('/notifications') as any;
    return Array.isArray(response) ? response : [];
  },

  async markAllAsRead() {
    return fetchApi('/notifications/read', { method: 'POST' });
  },
};