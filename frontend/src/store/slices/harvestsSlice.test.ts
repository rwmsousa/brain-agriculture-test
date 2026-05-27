import harvestsReducer, { fetchHarvests, createHarvest } from './harvestsSlice';
import { Harvest } from '../../types';

jest.mock('../../services/harvests.service');

const mockHarvest: Harvest = { id: 'h-uuid', name: 'Safra 2024' };

const initialState = { items: [], status: 'idle' as const, error: null };

describe('harvestsSlice', () => {
  describe('estado inicial', () => {
    it('tem o estado inicial correto', () => {
      const state = harvestsReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('fetchHarvests', () => {
    it('define status como loading no pending', () => {
      const state = harvestsReducer(undefined, fetchHarvests.pending('', undefined));
      expect(state.status).toBe('loading');
    });

    it('atualiza items no fulfilled', () => {
      const items = [mockHarvest, { id: 'h-2', name: 'Safra 2023' }];
      const state = harvestsReducer(undefined, fetchHarvests.fulfilled(items, '', undefined));
      expect(state.status).toBe('succeeded');
      expect(state.items).toHaveLength(2);
    });

    it('define error no rejected com mensagem', () => {
      const state = harvestsReducer(
        undefined,
        fetchHarvests.rejected(new Error('Falha ao buscar safras'), '', undefined),
      );
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Falha ao buscar safras');
    });

    it('usa mensagem padrão quando error.message é undefined', () => {
      const action = {
        type: fetchHarvests.rejected.type,
        error: { message: undefined },
        meta: { requestId: '', requestStatus: 'rejected', arg: undefined },
        payload: undefined,
      };
      const state = harvestsReducer(undefined, action as any);
      expect(state.error).toBe('Erro ao carregar safras');
    });
  });

  describe('createHarvest', () => {
    it('adiciona safra à lista no fulfilled', () => {
      const state = harvestsReducer(
        initialState,
        createHarvest.fulfilled(mockHarvest, '', { name: 'Safra 2024' }),
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockHarvest);
    });

    it('preserva itens existentes ao adicionar nova safra', () => {
      const existingState = {
        ...initialState,
        items: [{ id: 'h-1', name: 'Safra 2023' }],
      };
      const state = harvestsReducer(
        existingState,
        createHarvest.fulfilled(mockHarvest, '', { name: 'Safra 2024' }),
      );
      expect(state.items).toHaveLength(2);
    });
  });
});
