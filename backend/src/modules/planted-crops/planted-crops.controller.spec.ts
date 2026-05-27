import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PlantedCropsController } from './planted-crops.controller';
import { PlantedCropsService } from './planted-crops.service';
import { PlantedCrop } from './entities/planted-crop.entity';

const mockPlantedCropsService = {
  findByFarmId: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

describe('PlantedCropsController', () => {
  let controller: PlantedCropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantedCropsController],
      providers: [{ provide: PlantedCropsService, useValue: mockPlantedCropsService }],
    }).compile();

    controller = module.get<PlantedCropsController>(PlantedCropsController);
    jest.clearAllMocks();
  });

  describe('findByFarmId', () => {
    it('retorna lista de culturas de uma fazenda', async () => {
      const items = [{ id: 'pc-1' }, { id: 'pc-2' }] as PlantedCrop[];
      mockPlantedCropsService.findByFarmId.mockResolvedValue(items);

      const result = await controller.findByFarmId('farm-uuid');
      expect(result).toHaveLength(2);
      expect(mockPlantedCropsService.findByFarmId).toHaveBeenCalledWith('farm-uuid');
    });

    it('retorna lista vazia quando não há culturas', async () => {
      mockPlantedCropsService.findByFarmId.mockResolvedValue([]);
      const result = await controller.findByFarmId('farm-uuid');
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    const dto = {
      farmId: 'farm-uuid',
      harvestId: 'harvest-uuid',
      cropTypeId: 'crop-type-uuid',
    };

    it('cria cultura plantada com dados válidos', async () => {
      const created = { id: 'pc-uuid', ...dto } as PlantedCrop;
      mockPlantedCropsService.create.mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(mockPlantedCropsService.create).toHaveBeenCalledWith(dto);
    });

    it('propaga ConflictException para cultura duplicada', async () => {
      mockPlantedCropsService.create.mockRejectedValue(new ConflictException());
      await expect(controller.create(dto)).rejects.toThrow(ConflictException);
    });

    it('propaga NotFoundException quando fazenda não existe', async () => {
      mockPlantedCropsService.create.mockRejectedValue(new NotFoundException());
      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('remove cultura plantada pelo ID', async () => {
      mockPlantedCropsService.remove.mockResolvedValue(undefined);
      await expect(controller.remove('pc-uuid')).resolves.toBeUndefined();
      expect(mockPlantedCropsService.remove).toHaveBeenCalledWith('pc-uuid');
    });

    it('propaga NotFoundException quando cultura não existe', async () => {
      mockPlantedCropsService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
