import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';

const mockDataSource = {
  query: jest.fn(),
};

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardService, { provide: getDataSourceToken(), useValue: mockDataSource }],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    const totalResult = [{ total_farms: '10', total_hectares: '5000.5' }];
    const stateResult = [
      { state: 'MT', count: '4' },
      { state: 'GO', count: '3' },
    ];
    const cropTypeResult = [
      { crop_type: 'Soja', count: '7' },
      { crop_type: 'Milho', count: '5' },
    ];
    const landUseResult = [{ total_arable: '3000.0', total_vegetation: '1500.25' }];

    beforeEach(() => {
      mockDataSource.query
        .mockResolvedValueOnce(totalResult)
        .mockResolvedValueOnce(stateResult)
        .mockResolvedValueOnce(cropTypeResult)
        .mockResolvedValueOnce(landUseResult);
    });

    it('retorna totalFarms e totalHectares corretamente convertidos', async () => {
      const result = await service.getStats();
      expect(result.totalFarms).toBe(10);
      expect(result.totalHectares).toBe(5000.5);
    });

    it('retorna farmsByState com count como número inteiro', async () => {
      const result = await service.getStats();
      expect(result.farmsByState).toEqual([
        { state: 'MT', count: 4 },
        { state: 'GO', count: 3 },
      ]);
    });

    it('retorna farmsByCropType com count como número inteiro', async () => {
      const result = await service.getStats();
      expect(result.farmsByCropType).toEqual([
        { cropType: 'Soja', count: 7 },
        { cropType: 'Milho', count: 5 },
      ]);
    });

    it('retorna landUse com áreas corretamente convertidas para float', async () => {
      const result = await service.getStats();
      expect(result.landUse).toEqual({
        totalArableArea: 3000.0,
        totalVegetationArea: 1500.25,
      });
    });

    it('executa exatamente 4 queries SQL', async () => {
      await service.getStats();
      expect(mockDataSource.query).toHaveBeenCalledTimes(4);
    });

    it('retorna listas vazias quando não há fazendas ou culturas', async () => {
      mockDataSource.query.mockReset();
      mockDataSource.query
        .mockResolvedValueOnce([{ total_farms: '0', total_hectares: '0' }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ total_arable: '0', total_vegetation: '0' }]);

      const result = await service.getStats();
      expect(result.totalFarms).toBe(0);
      expect(result.totalHectares).toBe(0);
      expect(result.farmsByState).toHaveLength(0);
      expect(result.farmsByCropType).toHaveLength(0);
    });
  });
});
