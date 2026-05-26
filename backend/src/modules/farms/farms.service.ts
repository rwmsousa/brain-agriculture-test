import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Farm } from './entities/farm.entity';
import { FarmsRepository } from './farms.repository';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ProducersService } from '../producers/producers.service';

@Injectable()
export class FarmsService {
  constructor(
    private readonly farmsRepository: FarmsRepository,
    private readonly producersService: ProducersService,
  ) {}

  private validateAreaConstraint(
    totalArea: number,
    arableArea: number,
    vegetationArea: number,
  ): void {
    if (arableArea + vegetationArea > totalArea) {
      throw new UnprocessableEntityException(
        'A soma das areas agricultavel e de vegetacao nao pode exceder a area total da fazenda',
      );
    }
  }

  async create(dto: CreateFarmDto): Promise<Farm> {
    await this.producersService.findById(dto.producerId);

    this.validateAreaConstraint(
      dto.totalAreaHectares,
      dto.arableAreaHectares,
      dto.vegetationAreaHectares,
    );

    return this.farmsRepository.create({
      producerId: dto.producerId,
      name: dto.name,
      city: dto.city,
      state: dto.state,
      totalAreaHectares: dto.totalAreaHectares,
      arableAreaHectares: dto.arableAreaHectares,
      vegetationAreaHectares: dto.vegetationAreaHectares,
    });
  }

  findAll(): Promise<Farm[]> {
    return this.farmsRepository.findAll();
  }

  async findById(id: string): Promise<Farm> {
    const farm = await this.farmsRepository.findById(id);
    if (!farm) {
      throw new NotFoundException(`Fazenda com id ${id} nao encontrada`);
    }
    return farm;
  }

  findByProducerId(producerId: string): Promise<Farm[]> {
    return this.farmsRepository.findByProducerId(producerId);
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
    const existing = await this.findById(id);

    const totalArea = dto.totalAreaHectares ?? existing.totalAreaHectares;
    const arableArea = dto.arableAreaHectares ?? existing.arableAreaHectares;
    const vegetationArea = dto.vegetationAreaHectares ?? existing.vegetationAreaHectares;

    this.validateAreaConstraint(Number(totalArea), Number(arableArea), Number(vegetationArea));

    return this.farmsRepository.update(id, dto as Partial<Farm>);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    return this.farmsRepository.delete(id);
  }
}
