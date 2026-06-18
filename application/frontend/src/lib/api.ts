import axios, { AxiosInstance } from 'axios';
import {
  Flight,
  PaginatedResponse,
  AnalyticsResponse,
  AirportInfo,
  RouteStats,
} from '../types.js';

const API_BASE_URL = '/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Error interceptor for better user feedback
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      error.backendUnavailable = true;
      error.userMessage = 'Backend server is not running. Please start it with: cd ../backend && npm run dev';
    }
    return Promise.reject(error);
  }
);

export const flightAPI = {
  getFlights: (page: number = 1, limit: number = 100) =>
    apiClient.get<PaginatedResponse<Flight>>('/flights', {
      params: { page, limit },
    }),

  searchFlights: (
    page: number = 1,
    limit: number = 100,
    filters: {
      origin?: string;
      destination?: string;
      carrier?: string;
      minDelay?: number;
      maxDelay?: number;
      year?: number;
      month?: number;
    } = {}
  ) =>
    apiClient.get<PaginatedResponse<Flight>>('/flights/search', {
      params: { page, limit, ...filters },
    }),

  getAirports: () =>
    apiClient.get<{ airports: string[] }>('/flights/airports'),

  getCarriers: () =>
    apiClient.get<{ carriers: string[] }>('/flights/carriers'),
};

export const analyticsAPI = {
  getDelayAnalytics: () =>
    apiClient.get<AnalyticsResponse>('/analytics/delays'),

  getRouteStats: (limit: number = 100) =>
    apiClient.get<{ routes: RouteStats[]; total: number }>('/analytics/routes', {
      params: { limit },
    }),

  getAirportInfo: () =>
    apiClient.get<{ airports: AirportInfo[] }>('/analytics/airports'),
};

export default apiClient;
