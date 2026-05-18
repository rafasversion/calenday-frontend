import { fetchApi } from './api';

export interface TaskFilters {
  text?: string;
  status?: 'todo' | 'doing' | 'done' | 'Todas';
  date_start?: string;
  date_end?: string;
}

interface TaskResponse {
  tasks: any[];
  total: number;
  page: number;
  total_pages: number;
}

export const taskService = {
  async getAll(filters: TaskFilters = {}) {
    const params = new URLSearchParams();

    if (filters.text && filters.text.trim() !== "") {
      params.append('text', filters.text.trim());
    }
    if (filters.status && filters.status !== 'Todas') params.append('status', filters.status);
    if (filters.date_start) params.append('date_start', filters.date_start);
    if (filters.date_end) params.append('date_end', filters.date_end);

    const queryString = params.toString();
    const response = await fetchApi(`/task${queryString ? `?${queryString}` : ''}`) as TaskResponse;
    return response.tasks || [];
  },

  async getById(id: number) {
    return fetchApi(`/task/${id}`);
  },

  async create(data: {
    title: string;
    description?: string;
    date_start: string;
    date_end: string;
    status: 'todo' | 'doing' | 'done';
    priority?: 'low' | 'medium' | 'high';
    tag_ids?: number[];
    files?: File[];
  }) {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description || "");
    formData.append('date_start', data.date_start);
    formData.append('date_end', data.date_end);
    formData.append('status', data.status);
    if (data.priority) formData.append('priority', data.priority);

    if (data.tag_ids) {
      formData.append('tag_ids', JSON.stringify(data.tag_ids));
    }

    if (data.files) {
      data.files.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    console.log({
      ...data,
      date_start: data.date_start,
      date_end: data.date_end,
    });

    return fetchApi('/task', {
      method: 'POST',
      body: formData,
    });
  },

  async update(id: number, data: any) {
    return fetchApi(`/task/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  async delete(id: number) {
    return fetchApi(`/task/${id}`, {
      method: 'DELETE',
    });
  }
};