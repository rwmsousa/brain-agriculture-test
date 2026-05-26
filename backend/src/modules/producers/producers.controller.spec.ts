import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

const mockProducersService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProducersController', () => {
  let controller: ProducersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [{ provide: ProducersService, useValue: mockProducersService }],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns array of producers', async () => {
      const producers = [{ id: '1', name: 'Test' }];
      mockProducersService.findAll.mockResolvedValue(producers);

      const result = await controller.findAll();
      expect(result).toEqual(producers);
    });
  });

  describe('findById', () => {
    it('returns a producer by id', async () => {
      const producer = { id: 'uuid', name: 'Test' };
      mockProducersService.findById.mockResolvedValue(producer);

      const result = await controller.findById('uuid');
      expect(result).toEqual(producer);
    });

    it('propagates NotFoundException', async () => {
      mockProducersService.findById.mockRejectedValue(new NotFoundException());
      await expect(controller.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a producer', async () => {
      const dto = { document: '529.982.247-25', documentType: 'CPF' as const, name: 'Test' };
      const created = { id: 'uuid', ...dto };
      mockProducersService.create.mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(result).toEqual(created);
    });

    it('propagates UnprocessableEntityException for invalid CPF', async () => {
      mockProducersService.create.mockRejectedValue(new UnprocessableEntityException());
      await expect(
        controller.create({ document: 'invalid', documentType: 'CPF', name: 'Test' }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('propagates ConflictException for duplicate document', async () => {
      mockProducersService.create.mockRejectedValue(new ConflictException());
      await expect(
        controller.create({ document: '52998224725', documentType: 'CPF', name: 'Test' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('updates a producer', async () => {
      const updated = { id: 'uuid', name: 'New Name' };
      mockProducersService.update.mockResolvedValue(updated);

      const result = await controller.update('uuid', { name: 'New Name' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('removes a producer', async () => {
      mockProducersService.remove.mockResolvedValue(undefined);
      await expect(controller.remove('uuid')).resolves.toBeUndefined();
    });
  });
});
