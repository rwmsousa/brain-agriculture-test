import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'brain',
    password: process.env.POSTGRES_PASSWORD || 'agriculture',
    database: process.env.POSTGRES_DB || 'brain_agriculture',
    synchronize: false,
    migrationsRun: true,
    migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    logging: process.env.NODE_ENV === 'development',
  }),
);
