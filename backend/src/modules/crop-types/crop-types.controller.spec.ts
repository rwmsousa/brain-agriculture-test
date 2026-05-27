import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CropTypesController } from './crop-types.controller';
import { CropTypesService } from './crop-types.service';
import { CropType } from './entities/crop-type.entity';

const mockCropTypesService = {
  findAll: jest.fn(),
  create: jest.fn(),
};

describe('CropTypesController', () => {
  let controller: CropTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropTypesController],
      providers: [{ provide: CropTypesService, useValue: mockCropTypesService }],
    }).compile();

    controller = module.get<CropTypesController>(CropTypesController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna lista de tipos de cultura', async () => {
      const items = [
        { id: '1', name: 'Soja' },
        { id: '2', name: 'Milho' },
      ] as CropType[];
      mockCropTypesService.findAll.mockResolvedValue(items);

      const result = await controller.findAll();
      expect(result).toEqual(items);
      expect(mockCropTypesService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('cria tipo de cultura com nome válido', async () => {
      const created = { id: 'uuid', name: 'Trigo' } as CropType;
      mockCropTypesService.create.mockResolvedValue(created);

      const result = await controller.create({ name: 'Trigo' });
      expect(result).toEqual(created);
      expect(mockCropTypesService.create).toHaveBeenCalledWith({ name: 'Trigo' });
    });

    it('propaga ConflictException para nome duplicado', async () => {
      mockCropTypesService.create.mockRejectedValue(new ConflictException());
      await expect(controller.create({ name: 'Soja' })).rejects.toThrow(ConflictException);
    });
  });
});
