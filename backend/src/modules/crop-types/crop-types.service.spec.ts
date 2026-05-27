import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CropTypesService } from './crop-types.service';
import { CropTypesRepository } from './crop-types.repository';
import { CropType } from './entities/crop-type.entity';

const mockCropTypesRepository = {
  findAll: jest.fn(),
  findByName: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

describe('CropTypesService', () => {
  let service: CropTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropTypesService,
        { provide: CropTypesRepository, useValue: mockCropTypesRepository },
      ],
    }).compile();

    service = module.get<CropTypesService>(CropTypesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna todos os tipos de cultura', async () => {
      const items = [
        { id: '1', name: 'Soja' },
        { id: '2', name: 'Milho' },
      ] as CropType[];
      mockCropTypesRepository.findAll.mockResolvedValue(items);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(mockCropTypesRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('retorna lista vazia quando não há tipos cadastrados', async () => {
      mockCropTypesRepository.findAll.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('cria tipo de cultura com nome único', async () => {
      const created = { id: 'uuid', name: 'Algodão' } as CropType;
      mockCropTypesRepository.findByName.mockResolvedValue(null);
      mockCropTypesRepository.create.mockResolvedValue(created);

      const result = await service.create({ name: 'Algodão' });
      expect(result).toEqual(created);
      expect(mockCropTypesRepository.create).toHaveBeenCalledWith({ name: 'Algodão' });
    });

    it('lança ConflictException para nome duplicado', async () => {
      mockCropTypesRepository.findByName.mockResolvedValue({ id: 'existing', name: 'Soja' });

      await expect(service.create({ name: 'Soja' })).rejects.toThrow(ConflictException);
      expect(mockCropTypesRepository.create).not.toHaveBeenCalled();
    });

    it('inclui o nome na mensagem de ConflictException', async () => {
      mockCropTypesRepository.findByName.mockResolvedValue({ id: 'existing', name: 'Milho' });

      await expect(service.create({ name: 'Milho' })).rejects.toThrow(
        "Tipo de cultura 'Milho' ja cadastrado",
      );
    });
  });
});
