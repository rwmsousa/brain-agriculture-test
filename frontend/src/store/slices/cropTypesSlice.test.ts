import cropTypesReducer, { fetchCropTypes, createCropType } from './cropTypesSlice';
import { CropType } from '../../types';

jest.mock('../../services/cropTypes.service');

const mockCropType: CropType = { id: 'ct-uuid', name: 'Soja' };

const initialState = { items: [], status: 'idle' as const, error: null };

describe('cropTypesSlice', () => {
  describe('estado inicial', () => {
    it('tem o estado inicial correto', () => {
      const state = cropTypesReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('fetchCropTypes', () => {
    it('define status como loading no pending', () => {
      const state = cropTypesReducer(undefined, fetchCropTypes.pending('', undefined));
      expect(state.status).toBe('loading');
    });

    it('atualiza items no fulfilled', () => {
      const items = [mockCropType, { id: 'ct-2', name: 'Milho' }];
      const state = cropTypesReducer(undefined, fetchCropTypes.fulfilled(items, '', undefined));
      expect(state.status).toBe('succeeded');
      expect(state.items).toHaveLength(2);
    });

    it('define error no rejected', () => {
      const state = cropTypesReducer(
        undefined,
        fetchCropTypes.rejected(new Error('Falha ao buscar culturas'), '', undefined),
      );
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Falha ao buscar culturas');
    });

    it('usa mensagem padrão quando error.message é undefined', () => {
      const action = {
        type: fetchCropTypes.rejected.type,
        error: { message: undefined },
        meta: { requestId: '', requestStatus: 'rejected', arg: undefined },
        payload: undefined,
      };
      const state = cropTypesReducer(undefined, action as any);
      expect(state.error).toBe('Erro ao carregar tipos de cultura');
    });
  });

  describe('createCropType', () => {
    it('adiciona tipo de cultura à lista no fulfilled', () => {
      const state = cropTypesReducer(
        initialState,
        createCropType.fulfilled(mockCropType, '', { name: 'Soja' }),
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockCropType);
    });

    it('preserva itens existentes ao adicionar novo', () => {
      const existingState = {
        ...initialState,
        items: [{ id: 'ct-1', name: 'Milho' }],
      };
      const state = cropTypesReducer(
        existingState,
        createCropType.fulfilled(mockCropType, '', { name: 'Soja' }),
      );
      expect(state.items).toHaveLength(2);
    });
  });
});
