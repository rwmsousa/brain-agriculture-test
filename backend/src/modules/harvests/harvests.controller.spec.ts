import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsController } from './harvests.controller';
import { HarvestsService } from './harvests.service';
import { Harvest } from './entities/harvest.entity';

const mockHarvestsService = {
  findAll: jest.fn(),
  create: jest.fn(),
};

describe('HarvestsController', () => {
  let controller: HarvestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestsController],
      providers: [{ provide: HarvestsService, useValue: mockHarvestsService }],
    }).compile();

    controller = module.get<HarvestsController>(HarvestsController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna lista de safras', async () => {
      const items = [
        { id: '1', name: 'Safra 2023' },
        { id: '2', name: 'Safra 2024' },
      ] as Harvest[];
      mockHarvestsService.findAll.mockResolvedValue(items);

      const result = await controller.findAll();
      expect(result).toEqual(items);
      expect(mockHarvestsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('cria safra com nome válido', async () => {
      const created = { id: 'uuid', name: 'Safra 2025' } as Harvest;
      mockHarvestsService.create.mockResolvedValue(created);

      const result = await controller.create({ name: 'Safra 2025' });
      expect(result).toEqual(created);
      expect(mockHarvestsService.create).toHaveBeenCalledWith({ name: 'Safra 2025' });
    });

    it('propaga erros do service', async () => {
      mockHarvestsService.create.mockRejectedValue(new Error('DB error'));
      await expect(controller.create({ name: 'Safra X' })).rejects.toThrow('DB error');
    });
  });
});
