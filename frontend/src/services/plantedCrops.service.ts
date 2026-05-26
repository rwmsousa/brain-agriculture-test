import api from './api';
import { PlantedCrop } from '../types';

export const getPlantedCropsByFarm = (farmId: string): Promise<PlantedCrop[]> =>
  api.get<PlantedCrop[]>(`/farms/${farmId}/planted-crops`).then((r) => r.data);

export const addPlantedCrop = (data: {
  farmId: string;
  harvestId: string;
  cropTypeId: string;
}): Promise<PlantedCrop> => api.post<PlantedCrop>('/planted-crops', data).then((r) => r.data);

export const removePlantedCrop = (id: string): Promise<void> =>
  api.delete(`/planted-crops/${id}`).then(() => undefined);
