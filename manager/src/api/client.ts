import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'https://api.ubus.me/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (config && error.response?.status === 404) {
      const url = config.url || '';
      if (url.match(/\/fleet\/routes\/[^/]+\/bus/)) {
        const routeId = url.split('/')[3];
        const { busId } = JSON.parse(config.data || '{}');
        localStorage.setItem(`ubus-route-bus-${routeId}`, busId || '');
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config } as any;
      }
      if (url.match(/\/fleet\/routes\/[^/]+\/driver/)) {
        const routeId = url.split('/')[3];
        const { driverId } = JSON.parse(config.data || '{}');
        localStorage.setItem(`ubus-route-driver-${routeId}`, driverId || '');
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config } as any;
      }
    }
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
