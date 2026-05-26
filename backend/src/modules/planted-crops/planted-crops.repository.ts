import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlantedCrop } from './entities/planted-crop.entity';

@Injectable()
export class PlantedCropsRepository {
  constructor(
    @InjectRepository(PlantedCrop)
    private readonly repo: Repository<PlantedCrop>,
  ) {}

  findByFarmId(farmId: string): Promise<PlantedCrop[]> {
    return this.repo.find({
      where: { farmId },
      relations: ['harvest', 'cropType'],
    });
  }

  findById(id: string): Promise<PlantedCrop | null> {
    return this.repo.findOne({ where: { id }, relations: ['harvest', 'cropType'] });
  }

  async create(data: Partial<PlantedCrop>): Promise<PlantedCrop> {
    const plantedCrop = this.repo.create(data);
    return this.repo.save(plantedCrop);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
