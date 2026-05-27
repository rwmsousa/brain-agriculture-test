import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { Farm } from './entities/farm.entity';

const mockFarmsService = {
  findByProducerId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockFarm: Partial<Farm> = {
  id: 'farm-uuid',
  name: 'Fazenda Santa Rosa',
  city: 'Rondonópolis',
  state: 'MT',
  totalAreaHectares: 500,
  arableAreaHectares: 300,
  vegetationAreaHectares: 150,
};

describe('FarmsController', () => {
  let controller: FarmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [{ provide: FarmsService, useValue: mockFarmsService }],
    }).compile();

    controller = module.get<FarmsController>(FarmsController);
    jest.clearAllMocks();
  });

  describe('findByProducerId', () => {
    it('retorna lista de fazendas do produtor', async () => {
      mockFarmsService.findByProducerId.mockResolvedValue([mockFarm]);
      const result = await controller.findByProducerId('producer-uuid');
      expect(result).toHaveLength(1);
      expect(mockFarmsService.findByProducerId).toHaveBeenCalledWith('producer-uuid');
    });

    it('retorna lista vazia quando produtor não tem fazendas', async () => {
      mockFarmsService.findByProducerId.mockResolvedValue([]);
      const result = await controller.findByProducerId('producer-uuid');
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('retorna fazenda pelo ID', async () => {
      mockFarmsService.findById.mockResolvedValue(mockFarm);
      const result = await controller.findById('farm-uuid');
      expect(result).toEqual(mockFarm);
    });

    it('propaga NotFoundException quando fazenda não existe', async () => {
      mockFarmsService.findById.mockRejectedValue(new NotFoundException());
      await expect(controller.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto = {
      producerId: 'producer-uuid',
      name: 'Fazenda Nova',
      city: 'Cuiabá',
      state: 'MT',
      totalAreaHectares: 200,
      arableAreaHectares: 100,
      vegetationAreaHectares: 80,
    };

    it('cria fazenda com dados válidos', async () => {
      const created = { id: 'new-uuid', ...createDto };
      mockFarmsService.create.mockResolvedValue(created);

      const result = await controller.create(createDto);
      expect(result).toEqual(created);
      expect(mockFarmsService.create).toHaveBeenCalledWith(createDto);
    });

    it('propaga UnprocessableEntityException para áreas inválidas', async () => {
      mockFarmsService.create.mockRejectedValue(new UnprocessableEntityException());
      await expect(controller.create(createDto)).rejects.toThrow(UnprocessableEntityException);
    });

    it('propaga NotFoundException quando produtor não existe', async () => {
      mockFarmsService.create.mockRejectedValue(new NotFoundException());
      await expect(controller.create(createDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('atualiza fazenda com dados válidos', async () => {
      const updated = { ...mockFarm, name: 'Fazenda Atualizada' };
      mockFarmsService.update.mockResolvedValue(updated);

      const result = await controller.update('farm-uuid', { name: 'Fazenda Atualizada' });
      expect(result).toEqual(updated);
      expect(mockFarmsService.update).toHaveBeenCalledWith('farm-uuid', {
        name: 'Fazenda Atualizada',
      });
    });

    it('propaga UnprocessableEntityException para áreas inválidas', async () => {
      mockFarmsService.update.mockRejectedValue(new UnprocessableEntityException());
      await expect(controller.update('farm-uuid', { arableAreaHectares: 999 })).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('propaga NotFoundException quando fazenda não existe', async () => {
      mockFarmsService.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update('nonexistent', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('remove fazenda pelo ID', async () => {
      mockFarmsService.remove.mockResolvedValue(undefined);
      await expect(controller.remove('farm-uuid')).resolves.toBeUndefined();
      expect(mockFarmsService.remove).toHaveBeenCalledWith('farm-uuid');
    });

    it('propaga NotFoundException quando fazenda não existe', async () => {
      mockFarmsService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
