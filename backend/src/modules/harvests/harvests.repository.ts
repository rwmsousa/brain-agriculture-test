import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harvest } from './entities/harvest.entity';

@Injectable()
export class HarvestsRepository {
  constructor(
    @InjectRepository(Harvest)
    private readonly repo: Repository<Harvest>,
  ) {}

  findAll(): Promise<Harvest[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<Harvest | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Harvest>): Promise<Harvest> {
    const harvest = this.repo.create(data);
    return this.repo.save(harvest);
  }
}
