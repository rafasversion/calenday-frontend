const API_BASE = `${import.meta.env.VITE_API_URL}api`;

export const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T | null> => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

    const token = localStorage.getItem('token');
    const isFormData = options?.body instanceof FormData;

    const finalHeaders: Record<string, string> = {};

    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    if (!isFormData) {
      finalHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(fullUrl, {
      method: options?.method || 'GET',
      body: options?.body,
      headers: finalHeaders,
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Sessão expirada ou token inválido.");
      }

      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) console.error('fetchApi error:', error.message);
    return null;
  }
};