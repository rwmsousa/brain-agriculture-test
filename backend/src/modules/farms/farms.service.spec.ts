import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { FarmsRepository } from './farms.repository';
import { ProducersService } from '../producers/producers.service';
import { Farm } from './entities/farm.entity';

const mockFarmsRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByProducerId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockProducersService = {
  findById: jest.fn(),
};

describe('FarmsService', () => {
  let service: FarmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        { provide: FarmsRepository, useValue: mockFarmsRepository },
        { provide: ProducersService, useValue: mockProducersService },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const validDto = {
      producerId: 'producer-uuid',
      name: 'Fazenda Santa Rosa',
      city: 'Rondonopolis',
      state: 'MT',
      totalAreaHectares: 500,
      arableAreaHectares: 300,
      vegetationAreaHectares: 150,
    };

    it('creates farm with valid areas', async () => {
      mockProducersService.findById.mockResolvedValue({ id: 'producer-uuid' });
      mockFarmsRepository.create.mockResolvedValue({ id: 'farm-uuid', ...validDto });

      const result = await service.create(validDto);
      expect(result.id).toBe('farm-uuid');
    });

    it('creates farm when arable + vegetation equals total (boundary case)', async () => {
      mockProducersService.findById.mockResolvedValue({ id: 'producer-uuid' });
      mockFarmsRepository.create.mockResolvedValue({ id: 'farm-uuid' });

      const boundaryDto = { ...validDto, arableAreaHectares: 350, vegetationAreaHectares: 150 };
      await expect(service.create(boundaryDto)).resolves.toBeDefined();
    });

    it('throws UnprocessableEntityException when arable + vegetation > total', async () => {
      mockProducersService.findById.mockResolvedValue({ id: 'producer-uuid' });

      const invalidDto = { ...validDto, arableAreaHectares: 400, vegetationAreaHectares: 200 };
      await expect(service.create(invalidDto)).rejects.toThrow(UnprocessableEntityException);
    });

    it('throws NotFoundException when producer not found', async () => {
      mockProducersService.findById.mockRejectedValue(new NotFoundException());
      await expect(service.create(validDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('returns farm when found', async () => {
      const farm = { id: 'farm-uuid' } as Farm;
      mockFarmsRepository.findById.mockResolvedValue(farm);

      const result = await service.findById('farm-uuid');
      expect(result).toEqual(farm);
    });

    it('throws NotFoundException when not found', async () => {
      mockFarmsRepository.findById.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const existingFarm = {
      id: 'farm-uuid',
      totalAreaHectares: 500,
      arableAreaHectares: 300,
      vegetationAreaHectares: 150,
    } as Farm;

    it('re-validates area constraint on update', async () => {
      mockFarmsRepository.findById.mockResolvedValue(existingFarm);

      await expect(
        service.update('farm-uuid', { arableAreaHectares: 400, vegetationAreaHectares: 200 }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('updates successfully with valid areas', async () => {
      mockFarmsRepository.findById.mockResolvedValue(existingFarm);
      mockFarmsRepository.update.mockResolvedValue({ ...existingFarm, name: 'New Name' });

      await expect(service.update('farm-uuid', { name: 'New Name' })).resolves.toBeDefined();
    });
  });

  describe('findByProducerId', () => {
    it('returns farms for a given producer', async () => {
      const farms = [{ id: 'farm-1' }, { id: 'farm-2' }] as Farm[];
      mockFarmsRepository.findByProducerId.mockResolvedValue(farms);

      const result = await service.findByProducerId('producer-uuid');
      expect(result).toHaveLength(2);
    });
  });
});
