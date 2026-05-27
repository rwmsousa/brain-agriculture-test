import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';
import { HarvestsRepository } from './harvests.repository';
import { HarvestsService } from './harvests.service';
import { HarvestsController } from './harvests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest])],
  providers: [HarvestsRepository, HarvestsService],
  controllers: [HarvestsController],
  exports: [HarvestsRepository, HarvestsService],
})
export class HarvestsModule {}
