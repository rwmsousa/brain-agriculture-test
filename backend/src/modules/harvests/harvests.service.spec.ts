import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsService } from './harvests.service';
import { HarvestsRepository } from './harvests.repository';
import { Harvest } from './entities/harvest.entity';

const mockHarvestsRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

describe('HarvestsService', () => {
  let service: HarvestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        { provide: HarvestsRepository, useValue: mockHarvestsRepository },
      ],
    }).compile();

    service = module.get<HarvestsService>(HarvestsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna todas as safras', async () => {
      const items = [
        { id: '1', name: 'Safra 2023' },
        { id: '2', name: 'Safra 2024' },
      ] as Harvest[];
      mockHarvestsRepository.findAll.mockResolvedValue(items);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(mockHarvestsRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('retorna lista vazia quando não há safras', async () => {
      mockHarvestsRepository.findAll.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('cria safra com nome válido', async () => {
      const created = { id: 'uuid', name: 'Safra 2025' } as Harvest;
      mockHarvestsRepository.create.mockResolvedValue(created);

      const result = await service.create({ name: 'Safra 2025' });
      expect(result).toEqual(created);
      expect(mockHarvestsRepository.create).toHaveBeenCalledWith({ name: 'Safra 2025' });
    });
  });
});
