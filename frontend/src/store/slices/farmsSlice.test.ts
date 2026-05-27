import farmsReducer, {
  fetchFarmsByProducer,
  fetchFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
  clearSelectedFarm,
  clearFarms,
} from './farmsSlice';
import { Farm } from '../../types';

jest.mock('../../services/farms.service');

const mockFarm: Farm = {
  id: 'farm-uuid',
  producerId: 'producer-uuid',
  name: 'Fazenda Santa Rosa',
  city: 'Rondonópolis',
  state: 'MT',
  totalAreaHectares: 500,
  arableAreaHectares: 300,
  vegetationAreaHectares: 150,
  plantedCrops: [],
};

const initialState = {
  items: [],
  selected: null,
  status: 'idle' as const,
  error: null,
};

describe('farmsSlice', () => {
  describe('estado inicial', () => {
    it('tem o estado inicial correto', () => {
      const state = farmsReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers síncronos', () => {
    it('clearSelectedFarm define selected como null', () => {
      const state = farmsReducer({ ...initialState, selected: mockFarm }, clearSelectedFarm());
      expect(state.selected).toBeNull();
    });

    it('clearFarms limpa a lista de fazendas', () => {
      const state = farmsReducer({ ...initialState, items: [mockFarm] }, clearFarms());
      expect(state.items).toHaveLength(0);
    });
  });

  describe('fetchFarmsByProducer', () => {
    it('define status como loading no pending', () => {
      const state = farmsReducer(undefined, fetchFarmsByProducer.pending('', 'producer-uuid'));
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('atualiza items no fulfilled', () => {
      const state = farmsReducer(
        undefined,
        fetchFarmsByProducer.fulfilled([mockFarm], '', 'producer-uuid'),
      );
      expect(state.status).toBe('succeeded');
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockFarm);
    });

    it('define error no rejected', () => {
      const state = farmsReducer(
        undefined,
        fetchFarmsByProducer.rejected(new Error('Network error'), '', 'producer-uuid'),
      );
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network error');
    });

    it('usa mensagem padrão quando error.message é undefined', () => {
      const action = {
        type: fetchFarmsByProducer.rejected.type,
        error: { message: undefined },
        meta: { requestId: '', requestStatus: 'rejected', arg: 'producer-uuid' },
        payload: undefined,
      };
      const state = farmsReducer(undefined, action as any);
      expect(state.error).toBe('Erro ao carregar fazendas');
    });
  });

  describe('fetchFarmById', () => {
    it('define selected no fulfilled', () => {
      const state = farmsReducer(undefined, fetchFarmById.fulfilled(mockFarm, '', 'farm-uuid'));
      expect(state.selected).toEqual(mockFarm);
    });
  });

  describe('createFarm', () => {
    it('adiciona fazenda à lista no fulfilled', () => {
      const state = farmsReducer(
        initialState,
        createFarm.fulfilled(mockFarm, '', {
          producerId: 'producer-uuid',
          name: 'Fazenda Santa Rosa',
          city: 'Rondonópolis',
          state: 'MT',
          totalAreaHectares: 500,
          arableAreaHectares: 300,
          vegetationAreaHectares: 150,
        }),
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockFarm);
    });

    it('define error no rejected', () => {
      const state = farmsReducer(
        initialState,
        createFarm.rejected(new Error('Área inválida'), '', {
          producerId: 'p',
          name: 'F',
          city: 'C',
          state: 'MT',
          totalAreaHectares: 10,
          arableAreaHectares: 8,
          vegetationAreaHectares: 5,
        }),
      );
      expect(state.error).toBe('Área inválida');
    });

    it('usa mensagem padrão quando error.message é undefined no rejected', () => {
      const action = {
        type: createFarm.rejected.type,
        error: { message: undefined },
        meta: { requestId: '', requestStatus: 'rejected', arg: {} },
        payload: undefined,
      };
      const state = farmsReducer(initialState, action as any);
      expect(state.error).toBe('Erro ao criar fazenda');
    });
  });

  describe('updateFarm', () => {
    it('atualiza fazenda existente na lista no fulfilled', () => {
      const updatedFarm = { ...mockFarm, name: 'Fazenda Atualizada' };
      const state = farmsReducer(
        { ...initialState, items: [mockFarm] },
        updateFarm.fulfilled(updatedFarm, '', {
          id: 'farm-uuid',
          data: { name: 'Fazenda Atualizada' },
        }),
      );
      expect(state.items[0].name).toBe('Fazenda Atualizada');
    });

    it('atualiza selected se a fazenda selecionada foi atualizada', () => {
      const updatedFarm = { ...mockFarm, name: 'Nome Novo' };
      const state = farmsReducer(
        { ...initialState, items: [mockFarm], selected: mockFarm },
        updateFarm.fulfilled(updatedFarm, '', { id: 'farm-uuid', data: { name: 'Nome Novo' } }),
      );
      expect(state.selected?.name).toBe('Nome Novo');
    });

    it('não modifica selected se outra fazenda foi atualizada', () => {
      const otherFarm = { ...mockFarm, id: 'other-farm' };
      const updatedOther = { ...otherFarm, name: 'Outra Atualizada' };
      const state = farmsReducer(
        { ...initialState, items: [mockFarm, otherFarm], selected: mockFarm },
        updateFarm.fulfilled(updatedOther, '', {
          id: 'other-farm',
          data: { name: 'Outra Atualizada' },
        }),
      );
      expect(state.selected?.id).toBe('farm-uuid');
    });
  });

  describe('deleteFarm', () => {
    it('remove fazenda da lista no fulfilled', () => {
      const state = farmsReducer(
        { ...initialState, items: [mockFarm] },
        deleteFarm.fulfilled('farm-uuid', '', 'farm-uuid'),
      );
      expect(state.items).toHaveLength(0);
    });

    it('limpa selected se a fazenda deletada estava selecionada', () => {
      const state = farmsReducer(
        { ...initialState, items: [mockFarm], selected: mockFarm },
        deleteFarm.fulfilled('farm-uuid', '', 'farm-uuid'),
      );
      expect(state.selected).toBeNull();
    });

    it('não limpa selected se outra fazenda foi deletada', () => {
      const otherFarm = { ...mockFarm, id: 'other-farm' };
      const state = farmsReducer(
        { ...initialState, items: [mockFarm, otherFarm], selected: mockFarm },
        deleteFarm.fulfilled('other-farm', '', 'other-farm'),
      );
      expect(state.selected?.id).toBe('farm-uuid');
    });
  });
});
