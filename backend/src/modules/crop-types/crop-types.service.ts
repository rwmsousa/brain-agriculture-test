import { Injectable, ConflictException } from '@nestjs/common';
import { CropType } from './entities/crop-type.entity';
import { CropTypesRepository } from './crop-types.repository';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';

@Injectable()
export class CropTypesService {
  constructor(private readonly cropTypesRepository: CropTypesRepository) {}

  findAll(): Promise<CropType[]> {
    return this.cropTypesRepository.findAll();
  }

  async create(dto: CreateCropTypeDto): Promise<CropType> {
    const existing = await this.cropTypesRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(`Tipo de cultura '${dto.name}' ja cadastrado`);
    }
    return this.cropTypesRepository.create({ name: dto.name });
  }
}
