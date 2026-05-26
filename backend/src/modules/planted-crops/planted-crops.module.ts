import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantedCrop } from './entities/planted-crop.entity';
import { PlantedCropsRepository } from './planted-crops.repository';
import { PlantedCropsService } from './planted-crops.service';
import { PlantedCropsController } from './planted-crops.controller';
import { FarmsModule } from '../farms/farms.module';
import { HarvestsModule } from '../harvests/harvests.module';
import { CropTypesModule } from '../crop-types/crop-types.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlantedCrop]), FarmsModule, HarvestsModule, CropTypesModule],
  providers: [PlantedCropsRepository, PlantedCropsService],
  controllers: [PlantedCropsController],
})
export class PlantedCropsModule {}
