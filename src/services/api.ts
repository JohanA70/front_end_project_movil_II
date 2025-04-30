// src/services/api.ts

import axios from 'axios';
import { getToken } from './token'; // Asegúrate de que la ruta sea correcta

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

export async function getHeaders(options?: { contentType?: boolean; accept?: boolean; auth?: boolean }) {
  const headers: Record<string, string> = {};

  if (options?.contentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (options?.accept) {
    headers['Accept'] = 'application/json';
  }

  if (options?.auth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}


export default api;
