import api from './api';
import { DashboardStats } from '../types';

export const getDashboardStats = (): Promise<DashboardStats> =>
  api.get<DashboardStats>('/dashboard/stats').then((r) => r.data);
