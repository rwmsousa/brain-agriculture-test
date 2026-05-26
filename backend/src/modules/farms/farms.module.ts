import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from './entities/farm.entity';
import { FarmsRepository } from './farms.repository';
import { FarmsService } from './farms.service';
import { FarmsController } from './farms.controller';
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), ProducersModule],
  providers: [FarmsRepository, FarmsService],
  controllers: [FarmsController],
  exports: [FarmsService],
})
export class FarmsModule {}
