import { fetchApi } from './api';

export interface Event {
  id: number;
  author_id: number;
  title: string;
  description?: string;
  date_start: string;
  date_end?: string;
  location?: string;
  color: string;
  recurrence: 'none' | 'daily' | 'weekdays' | 'monthly';
  notify_at?: string;
  attachments?: any[];
}

export const eventService = {
  async getAll() {
    const response = await fetchApi('/events') as any;
    return Array.isArray(response) ? response : (response?.events || []);
  },

  async getById(id: number) {
    return fetchApi(`/event/${id}`);
  },

  async create(data: {
    title: string;
    description?: string;
    date_start: string;
    date_end?: string;
    location?: string;
    color?: string;
    recurrence?: string;
    notify_at?: string;
    files?: File[];
  }) {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('date_start', data.date_start);

    if (data.description) formData.append('description', data.description);
    if (data.date_end) formData.append('date_end', data.date_end);
    if (data.location) formData.append('location', data.location);
    if (data.color) formData.append('color', data.color);
    if (data.recurrence) formData.append('recurrence', data.recurrence);
    if (data.notify_at) formData.append('notify_at', data.notify_at);

    if (data.files) {
      data.files.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    return fetchApi('/event', {
      method: 'POST',
      body: formData,
    });
  },

  async update(id: number, data: Partial<Event>) {
    return fetchApi(`/event/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  async delete(id: number) {
    return fetchApi(`/event/${id}`, {
      method: 'DELETE',
    });
  }
};