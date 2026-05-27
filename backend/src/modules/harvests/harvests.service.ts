import { Injectable } from '@nestjs/common';
import { Harvest } from './entities/harvest.entity';
import { HarvestsRepository } from './harvests.repository';
import { CreateHarvestDto } from './dto/create-harvest.dto';

@Injectable()
export class HarvestsService {
  constructor(private readonly harvestsRepository: HarvestsRepository) {}

  findAll(): Promise<Harvest[]> {
    return this.harvestsRepository.findAll();
  }

  create(dto: CreateHarvestDto): Promise<Harvest> {
    return this.harvestsRepository.create({ name: dto.name });
  }
}
