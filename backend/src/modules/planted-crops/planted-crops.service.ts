import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PlantedCrop } from './entities/planted-crop.entity';
import { PlantedCropsRepository } from './planted-crops.repository';
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto';
import { FarmsService } from '../farms/farms.service';
import { HarvestsRepository } from '../harvests/harvests.repository';
import { CropTypesRepository } from '../crop-types/crop-types.repository';

@Injectable()
export class PlantedCropsService {
  constructor(
    private readonly plantedCropsRepository: PlantedCropsRepository,
    private readonly farmsService: FarmsService,
    private readonly harvestsRepository: HarvestsRepository,
    private readonly cropTypesRepository: CropTypesRepository,
  ) {}

  async create(dto: CreatePlantedCropDto): Promise<PlantedCrop> {
    await this.farmsService.findById(dto.farmId);

    const harvest = await this.harvestsRepository.findById(dto.harvestId);
    if (!harvest) {
      throw new NotFoundException(`Safra com id ${dto.harvestId} nao encontrada`);
    }

    const cropType = await this.cropTypesRepository.findById(dto.cropTypeId);
    if (!cropType) {
      throw new NotFoundException(`Tipo de cultura com id ${dto.cropTypeId} nao encontrado`);
    }

    try {
      return await this.plantedCropsRepository.create({
        farmId: dto.farmId,
        harvestId: dto.harvestId,
        cropTypeId: dto.cropTypeId,
      });
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err?.code === '23505') {
        throw new ConflictException('Cultura ja cadastrada para esta fazenda e safra');
      }
      throw error;
    }
  }

  findByFarmId(farmId: string): Promise<PlantedCrop[]> {
    return this.plantedCropsRepository.findByFarmId(farmId);
  }

  async remove(id: string): Promise<void> {
    const plantedCrop = await this.plantedCropsRepository.findById(id);
    if (!plantedCrop) {
      throw new NotFoundException(`Cultura plantada com id ${id} nao encontrada`);
    }
    return this.plantedCropsRepository.delete(id);
  }
}
