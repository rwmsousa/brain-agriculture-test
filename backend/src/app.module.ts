import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersModule } from './modules/producers/producers.module';
import { FarmsModule } from './modules/farms/farms.module';
import { HarvestsModule } from './modules/harvests/harvests.module';
import { CropTypesModule } from './modules/crop-types/crop-types.module';
import { PlantedCropsModule } from './modules/planted-crops/planted-crops.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get<string>('POSTGRES_USER', 'brain'),
        password: config.get<string>('POSTGRES_PASSWORD', 'agriculture'),
        database: config.get<string>('POSTGRES_DB', 'brain_agriculture'),
        synchronize: false,
        migrationsRun: true,
        migrations: [__dirname + '/database/migrations/*.{ts,js}'],
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    ProducersModule,
    FarmsModule,
    HarvestsModule,
    CropTypesModule,
    PlantedCropsModule,
    DashboardModule,
  ],
})
export class AppModule {}
