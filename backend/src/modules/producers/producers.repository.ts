import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';

@Injectable()
export class ProducersRepository {
  constructor(
    @InjectRepository(Producer)
    private readonly repo: Repository<Producer>,
  ) {}

  findAll(): Promise<Producer[]> {
    // Carrega 'farms' para exibir o total de fazendas por produtor na listagem.
    return this.repo.find({ relations: ['farms'] });
  }

  findById(id: string): Promise<Producer | null> {
    return this.repo.findOne({
      where: { id },
      relations: [
        'farms',
        'farms.plantedCrops',
        'farms.plantedCrops.harvest',
        'farms.plantedCrops.cropType',
      ],
    });
  }

  findByDocument(document: string): Promise<Producer | null> {
    return this.repo.findOne({ where: { document } });
  }

  async create(data: Partial<Producer>): Promise<Producer> {
    const producer = this.repo.create(data);
    return this.repo.save(producer);
  }

  async update(id: string, data: Partial<Producer>): Promise<Producer> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<Producer>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
