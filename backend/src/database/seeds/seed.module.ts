import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CropType } from '../../modules/crop-types/entities/crop-type.entity';
import { Farm } from '../../modules/farms/entities/farm.entity';
import { Harvest } from '../../modules/harvests/entities/harvest.entity';
import { PlantedCrop } from '../../modules/planted-crops/entities/planted-crop.entity';
import { Producer } from '../../modules/producers/entities/producer.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producer, Farm, Harvest, CropType, PlantedCrop])],
  providers: [SeedService],
})
export class SeedModule {}
