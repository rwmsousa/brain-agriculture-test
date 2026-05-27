import api from './api';
import { Producer } from '../types';

export const getProducers = (): Promise<Producer[]> =>
  api.get<Producer[]>('/rural-producers').then((r) => r.data);

export const getProducerById = (id: string): Promise<Producer> =>
  api.get<Producer>(`/rural-producers/${id}`).then((r) => r.data);

export const createProducer = (data: {
  document: string;
  documentType: 'CPF' | 'CNPJ';
  name: string;
}): Promise<Producer> => api.post<Producer>('/rural-producers', data).then((r) => r.data);

export const updateProducer = (
  id: string,
  data: Partial<{ document: string; documentType: 'CPF' | 'CNPJ'; name: string }>,
): Promise<Producer> => api.patch<Producer>(`/rural-producers/${id}`, data).then((r) => r.data);

export const deleteProducer = (id: string): Promise<void> =>
  api.delete(`/rural-producers/${id}`).then(() => undefined);
