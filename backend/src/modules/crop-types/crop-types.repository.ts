import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CropType } from './entities/crop-type.entity';

@Injectable()
export class CropTypesRepository {
  constructor(
    @InjectRepository(CropType)
    private readonly repo: Repository<CropType>,
  ) {}

  findAll(): Promise<CropType[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<CropType | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByName(name: string): Promise<CropType | null> {
    return this.repo.findOne({ where: { name } });
  }

  async create(data: Partial<CropType>): Promise<CropType> {
    const cropType = this.repo.create(data);
    return this.repo.save(cropType);
  }
}
