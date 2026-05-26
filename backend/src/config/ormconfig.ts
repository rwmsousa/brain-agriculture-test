import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'brain',
  password: process.env.POSTGRES_PASSWORD || 'agriculture',
  database: process.env.POSTGRES_DB || 'brain_agriculture',
  synchronize: false,
  migrations: [path.join(__dirname, '../database/migrations/*.{ts,js}')],
  entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
});
