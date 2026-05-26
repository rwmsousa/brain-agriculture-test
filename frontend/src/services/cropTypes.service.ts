import api from './api';
import { CropType } from '../types';

export const getCropTypes = (): Promise<CropType[]> =>
  api.get<CropType[]>('/crop-types').then((r) => r.data);
