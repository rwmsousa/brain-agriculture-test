import api from './api';
import { Farm } from '../types';

export const getFarmsByProducer = (producerId: string): Promise<Farm[]> =>
  api.get<Farm[]>(`/rural-producers/${producerId}/farms`).then((r) => r.data);

export const getFarmById = (id: string): Promise<Farm> =>
  api.get<Farm>(`/farms/${id}`).then((r) => r.data);

export const createFarm = (
  data: Omit<Farm, 'id' | 'plantedCrops' | 'createdAt' | 'updatedAt'>,
): Promise<Farm> => api.post<Farm>('/farms', data).then((r) => r.data);

export const updateFarm = (
  id: string,
  data: Partial<Omit<Farm, 'id' | 'producerId' | 'plantedCrops' | 'createdAt' | 'updatedAt'>>,
): Promise<Farm> => api.patch<Farm>(`/farms/${id}`, data).then((r) => r.data);

export const deleteFarm = (id: string): Promise<void> =>
  api.delete(`/farms/${id}`).then(() => undefined);
