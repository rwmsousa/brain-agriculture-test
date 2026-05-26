import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropType } from './entities/crop-type.entity';
import { CropTypesRepository } from './crop-types.repository';
import { CropTypesService } from './crop-types.service';
import { CropTypesController } from './crop-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CropType])],
  providers: [CropTypesRepository, CropTypesService],
  controllers: [CropTypesController],
  exports: [CropTypesRepository, CropTypesService],
})
export class CropTypesModule {}
