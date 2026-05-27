import plantedCropsReducer, {
  fetchPlantedCropsByFarm,
  addPlantedCrop,
  removePlantedCrop,
} from './plantedCropsSlice';
import { PlantedCrop } from '../../types';

jest.mock('../../services/plantedCrops.service');

const mockPlantedCrop: PlantedCrop = {
  id: 'pc-uuid',
  farmId: 'farm-uuid',
  harvestId: 'harvest-uuid',
  cropTypeId: 'crop-type-uuid',
  harvest: { id: 'harvest-uuid', name: 'Safra 2024' },
  cropType: { id: 'crop-type-uuid', name: 'Soja' },
};

const initialState = { items: [], status: 'idle' as const, error: null };

describe('plantedCropsSlice', () => {
  describe('estado inicial', () => {
    it('tem o estado inicial correto', () => {
      const state = plantedCropsReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('fetchPlantedCropsByFarm', () => {
    it('substitui a lista de culturas no fulfilled', () => {
      const items = [mockPlantedCrop, { ...mockPlantedCrop, id: 'pc-2' }];
      const state = plantedCropsReducer(
        undefined,
        fetchPlantedCropsByFarm.fulfilled(items, '', 'farm-uuid'),
      );
      expect(state.items).toHaveLength(2);
    });

    it('substitui itens anteriores com os novos (não concatena)', () => {
      const existingState = { ...initialState, items: [mockPlantedCrop] };
      const newItem = { ...mockPlantedCrop, id: 'pc-new' };
      const state = plantedCropsReducer(
        existingState,
        fetchPlantedCropsByFarm.fulfilled([newItem], '', 'farm-uuid'),
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('pc-new');
    });
  });

  describe('addPlantedCrop', () => {
    it('adiciona cultura à lista no fulfilled', () => {
      const state = plantedCropsReducer(
        initialState,
        addPlantedCrop.fulfilled(mockPlantedCrop, '', {
          farmId: 'farm-uuid',
          harvestId: 'harvest-uuid',
          cropTypeId: 'crop-type-uuid',
        }),
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPlantedCrop);
    });

    it('preserva itens existentes ao adicionar nova cultura', () => {
      const existing = { ...mockPlantedCrop, id: 'pc-existing' };
      const existingState = { ...initialState, items: [existing] };
      const newCrop = { ...mockPlantedCrop, id: 'pc-new' };

      const state = plantedCropsReducer(
        existingState,
        addPlantedCrop.fulfilled(newCrop, '', {
          farmId: 'farm-uuid',
          harvestId: 'harvest-uuid',
          cropTypeId: 'crop-type-uuid',
        }),
      );
      expect(state.items).toHaveLength(2);
    });
  });

  describe('removePlantedCrop', () => {
    it('remove cultura pelo ID no fulfilled', () => {
      const state = plantedCropsReducer(
        { ...initialState, items: [mockPlantedCrop] },
        removePlantedCrop.fulfilled('pc-uuid', '', 'pc-uuid'),
      );
      expect(state.items).toHaveLength(0);
    });

    it('não remove outros itens ao deletar um específico', () => {
      const anotherCrop = { ...mockPlantedCrop, id: 'pc-other' };
      const state = plantedCropsReducer(
        { ...initialState, items: [mockPlantedCrop, anotherCrop] },
        removePlantedCrop.fulfilled('pc-uuid', '', 'pc-uuid'),
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('pc-other');
    });
  });
});
