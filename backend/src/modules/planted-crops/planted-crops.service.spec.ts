import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PlantedCropsService } from './planted-crops.service';
import { PlantedCropsRepository } from './planted-crops.repository';
import { FarmsService } from '../farms/farms.service';
import { HarvestsRepository } from '../harvests/harvests.repository';
import { CropTypesRepository } from '../crop-types/crop-types.repository';
import { PlantedCrop } from './entities/planted-crop.entity';

const mockPlantedCropsRepository = {
  findByFarmId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockFarmsService = {
  findById: jest.fn(),
};

const mockHarvestsRepository = {
  findById: jest.fn(),
};

const mockCropTypesRepository = {
  findById: jest.fn(),
};

describe('PlantedCropsService', () => {
  let service: PlantedCropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantedCropsService,
        { provide: PlantedCropsRepository, useValue: mockPlantedCropsRepository },
        { provide: FarmsService, useValue: mockFarmsService },
        { provide: HarvestsRepository, useValue: mockHarvestsRepository },
        { provide: CropTypesRepository, useValue: mockCropTypesRepository },
      ],
    }).compile();

    service = module.get<PlantedCropsService>(PlantedCropsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = {
      farmId: 'farm-uuid',
      harvestId: 'harvest-uuid',
      cropTypeId: 'crop-type-uuid',
    };

    it('cria cultura plantada com dados válidos', async () => {
      const created = { id: 'pc-uuid', ...dto } as PlantedCrop;
      mockFarmsService.findById.mockResolvedValue({ id: 'farm-uuid' });
      mockHarvestsRepository.findById.mockResolvedValue({ id: 'harvest-uuid', name: 'Safra 2024' });
      mockCropTypesRepository.findById.mockResolvedValue({ id: 'crop-type-uuid', name: 'Soja' });
      mockPlantedCropsRepository.create.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(mockPlantedCropsRepository.create).toHaveBeenCalledWith(dto);
    });

    it('lança NotFoundException quando fazenda não existe', async () => {
      mockFarmsService.findById.mockRejectedValue(new NotFoundException('Fazenda não encontrada'));
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('lança NotFoundException quando safra não existe', async () => {
      mockFarmsService.findById.mockResolvedValue({ id: 'farm-uuid' });
      mockHarvestsRepository.findById.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('lança NotFoundException quando tipo de cultura não existe', async () => {
      mockFarmsService.findById.mockResolvedValue({ id: 'farm-uuid' });
      mockHarvestsRepository.findById.mockResolvedValue({ id: 'harvest-uuid' });
      mockCropTypesRepository.findById.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('lança ConflictException para cultura duplicada (código 23505)', async () => {
      mockFarmsService.findById.mockResolvedValue({ id: 'farm-uuid' });
      mockHarvestsRepository.findById.mockResolvedValue({ id: 'harvest-uuid' });
      mockCropTypesRepository.findById.mockResolvedValue({ id: 'crop-type-uuid' });
      const dbError = { code: '23505' };
      mockPlantedCropsRepository.create.mockRejectedValue(dbError);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('propaga outros erros do repositório sem conversão', async () => {
      mockFarmsService.findById.mockResolvedValue({ id: 'farm-uuid' });
      mockHarvestsRepository.findById.mockResolvedValue({ id: 'harvest-uuid' });
      mockCropTypesRepository.findById.mockResolvedValue({ id: 'crop-type-uuid' });
      const genericError = new Error('DB connection failed');
      mockPlantedCropsRepository.create.mockRejectedValue(genericError);

      await expect(service.create(dto)).rejects.toThrow('DB connection failed');
    });
  });

  describe('findByFarmId', () => {
    it('retorna culturas plantadas de uma fazenda', async () => {
      const items = [{ id: 'pc-1' }, { id: 'pc-2' }] as PlantedCrop[];
      mockPlantedCropsRepository.findByFarmId.mockResolvedValue(items);

      const result = await service.findByFarmId('farm-uuid');
      expect(result).toHaveLength(2);
      expect(mockPlantedCropsRepository.findByFarmId).toHaveBeenCalledWith('farm-uuid');
    });
  });

  describe('remove', () => {
    it('remove cultura plantada pelo ID', async () => {
      mockPlantedCropsRepository.findById.mockResolvedValue({ id: 'pc-uuid' } as PlantedCrop);
      mockPlantedCropsRepository.delete.mockResolvedValue(undefined);

      await service.remove('pc-uuid');
      expect(mockPlantedCropsRepository.delete).toHaveBeenCalledWith('pc-uuid');
    });

    it('lança NotFoundException quando cultura não existe', async () => {
      mockPlantedCropsRepository.findById.mockResolvedValue(null);
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
