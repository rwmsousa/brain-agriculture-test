import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { ProducersRepository } from './producers.repository';
import { Producer } from './entities/producer.entity';

const mockProducersRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByDocument: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProducersService', () => {
  let service: ProducersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: ProducersRepository, useValue: mockProducersRepository },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a producer with a valid CPF', async () => {
      const dto = {
        document: '529.982.247-25',
        documentType: 'CPF' as const,
        name: 'Joao da Silva',
      };
      mockProducersRepository.findByDocument.mockResolvedValue(null);
      mockProducersRepository.create.mockResolvedValue({
        id: 'uuid',
        ...dto,
        document: '52998224725',
      });

      const result = await service.create(dto);
      expect(result.document).toBe('52998224725');
      expect(mockProducersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ document: '52998224725' }),
      );
    });

    it('creates a producer with a valid CNPJ', async () => {
      const dto = {
        document: '11.222.333/0001-81',
        documentType: 'CNPJ' as const,
        name: 'Empresa SA',
      };
      mockProducersRepository.findByDocument.mockResolvedValue(null);
      mockProducersRepository.create.mockResolvedValue({
        id: 'uuid',
        ...dto,
        document: '11222333000181',
      });

      await expect(service.create(dto)).resolves.toBeDefined();
    });

    it('throws UnprocessableEntityException for invalid CPF', async () => {
      const dto = { document: '111.111.111-11', documentType: 'CPF' as const, name: 'Test' };
      await expect(service.create(dto)).rejects.toThrow(UnprocessableEntityException);
    });

    it('throws UnprocessableEntityException for invalid CNPJ', async () => {
      const dto = { document: '11.111.111/1111-11', documentType: 'CNPJ' as const, name: 'Test' };
      await expect(service.create(dto)).rejects.toThrow(UnprocessableEntityException);
    });

    it('throws UnprocessableEntityException for all-same-digit CPF', async () => {
      const dto = { document: '000.000.000-00', documentType: 'CPF' as const, name: 'Test' };
      await expect(service.create(dto)).rejects.toThrow(UnprocessableEntityException);
    });

    it('throws ConflictException for duplicate document', async () => {
      const dto = { document: '529.982.247-25', documentType: 'CPF' as const, name: 'Joao' };
      mockProducersRepository.findByDocument.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('returns producer when found', async () => {
      const producer = { id: 'uuid', name: 'Test' } as Producer;
      mockProducersRepository.findById.mockResolvedValue(producer);

      const result = await service.findById('uuid');
      expect(result).toEqual(producer);
    });

    it('throws NotFoundException when not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('returns all producers', async () => {
      const producers = [{ id: 'uuid', name: 'Test' } as Producer];
      mockProducersRepository.findAll.mockResolvedValue(producers);

      const result = await service.findAll();
      expect(result).toEqual(producers);
      expect(mockProducersRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('updates producer name', async () => {
      const existing = {
        id: 'uuid',
        document: '52998224725',
        documentType: 'CPF',
        name: 'Old Name',
      } as Producer;
      mockProducersRepository.findById.mockResolvedValue(existing);
      mockProducersRepository.update.mockResolvedValue({ ...existing, name: 'New Name' });

      const result = await service.update('uuid', { name: 'New Name' });
      expect(result.name).toBe('New Name');
    });

    it('re-validates document on update', async () => {
      const existing = {
        id: 'uuid',
        document: '52998224725',
        documentType: 'CPF',
        name: 'Test',
      } as Producer;
      mockProducersRepository.findById.mockResolvedValue(existing);

      await expect(
        service.update('uuid', { document: '111.111.111-11', documentType: 'CPF' }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('throws ConflictException when updating to a document already used by another producer', async () => {
      const existing = {
        id: 'uuid',
        document: '52998224725',
        documentType: 'CPF',
        name: 'Test',
      } as Producer;
      // 275.484.061-34 is a valid CPF different from the existing one
      const conflicting = {
        id: 'other-uuid',
        document: '27548406134',
        documentType: 'CPF',
        name: 'Other',
      } as Producer;
      mockProducersRepository.findById.mockResolvedValue(existing);
      mockProducersRepository.findByDocument.mockResolvedValue(conflicting);

      await expect(
        service.update('uuid', { document: '275.484.061-34', documentType: 'CPF' }),
      ).rejects.toThrow(ConflictException);
    });

    it('allows updating to the same document (no conflict)', async () => {
      const existing = {
        id: 'uuid',
        document: '52998224725',
        documentType: 'CPF',
        name: 'Test',
      } as Producer;
      mockProducersRepository.findById.mockResolvedValue(existing);
      mockProducersRepository.update.mockResolvedValue({ ...existing, name: 'New Name' });

      const result = await service.update('uuid', {
        document: '529.982.247-25',
        documentType: 'CPF',
        name: 'New Name',
      });
      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('calls delete on repository', async () => {
      mockProducersRepository.findById.mockResolvedValue({ id: 'uuid' } as Producer);
      mockProducersRepository.delete.mockResolvedValue(undefined);

      await service.remove('uuid');
      expect(mockProducersRepository.delete).toHaveBeenCalledWith('uuid');
    });
  });
});
