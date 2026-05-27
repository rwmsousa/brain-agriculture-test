import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';

@Injectable()
export class FarmsRepository {
  constructor(
    @InjectRepository(Farm)
    private readonly repo: Repository<Farm>,
  ) {}

  findAll(): Promise<Farm[]> {
    return this.repo.find({ relations: ['plantedCrops'] });
  }

  findById(id: string): Promise<Farm | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['plantedCrops', 'plantedCrops.harvest', 'plantedCrops.cropType'],
    });
  }

  findByProducerId(producerId: string): Promise<Farm[]> {
    return this.repo.find({
      where: { producerId },
      relations: ['plantedCrops', 'plantedCrops.harvest', 'plantedCrops.cropType'],
    });
  }

  async create(data: Partial<Farm>): Promise<Farm> {
    const farm = this.repo.create(data);
    return this.repo.save(farm);
  }

  async update(id: string, data: Partial<Farm>): Promise<Farm> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<Farm>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
