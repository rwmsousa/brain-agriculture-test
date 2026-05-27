import api from './api';
import { Harvest } from '../types';

export const getHarvests = (): Promise<Harvest[]> =>
  api.get<Harvest[]>('/harvests').then((r) => r.data);

export const createHarvest = (data: { name: string }): Promise<Harvest> =>
  api.post<Harvest>('/harvests', data).then((r) => r.data);
