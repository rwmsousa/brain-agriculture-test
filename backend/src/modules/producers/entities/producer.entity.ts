import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Farm } from '../../farms/entities/farm.entity';

@Entity('produtores')
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document', type: 'varchar', length: 18, unique: true })
  document: string;

  @Column({ name: 'document_type', type: 'varchar', length: 4 })
  documentType: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Farm, (farm) => farm.producer, { cascade: true })
  farms: Farm[];
}
