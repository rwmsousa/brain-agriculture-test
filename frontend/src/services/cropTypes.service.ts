import api from './api';
import { CropType } from '../types';

export const getCropTypes = (): Promise<CropType[]> =>
  api.get<CropType[]>('/crop-types').then((r) => r.data);

export const createCropType = (data: { name: string }): Promise<CropType> =>
  api.post<CropType>('/crop-types', data).then((r) => r.data);
