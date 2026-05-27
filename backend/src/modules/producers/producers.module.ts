import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './entities/producer.entity';
import { ProducersRepository } from './producers.repository';
import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  providers: [ProducersRepository, ProducersService],
  controllers: [ProducersController],
  exports: [ProducersService],
})
export class ProducersModule {}
