import { fetchApi } from './api';

export const tagService = {
  async getAll() {
    return fetchApi('/tags');
  },

  async create(name: string) {
    return fetchApi('/tag', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }
};