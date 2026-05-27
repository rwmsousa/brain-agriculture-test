import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

const mockStats = {
  totalFarms: 10,
  totalHectares: 5000.5,
  farmsByState: [{ state: 'MT', count: 4 }],
  farmsByCropType: [{ cropType: 'Soja', count: 7 }],
  landUse: { totalArableArea: 3000, totalVegetationArea: 1500 },
};

const mockDashboardService = {
  getStats: jest.fn(),
};

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [{ provide: DashboardService, useValue: mockDashboardService }],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('retorna as estatísticas do dashboard', async () => {
      mockDashboardService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();
      expect(result).toEqual(mockStats);
      expect(mockDashboardService.getStats).toHaveBeenCalledTimes(1);
    });

    it('propaga erro do service caso ocorra falha', async () => {
      mockDashboardService.getStats.mockRejectedValue(new Error('DB error'));
      await expect(controller.getStats()).rejects.toThrow('DB error');
    });
  });
});
