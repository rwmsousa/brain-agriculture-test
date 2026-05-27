import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Producer } from '../../producers/entities/producer.entity';
import { PlantedCrop } from '../../planted-crops/entities/planted-crop.entity';

@Entity('fazendas')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'producer_id', type: 'uuid' })
  producerId: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'city', type: 'varchar', length: 255 })
  city: string;

  @Column({ name: 'state', type: 'char', length: 2 })
  state: string;

  @Column({ name: 'total_area_hectares', type: 'decimal', precision: 12, scale: 4 })
  totalAreaHectares: number;

  @Column({ name: 'arable_area_hectares', type: 'decimal', precision: 12, scale: 4 })
  arableAreaHectares: number;

  @Column({ name: 'vegetation_area_hectares', type: 'decimal', precision: 12, scale: 4 })
  vegetationAreaHectares: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Producer, (producer) => producer.farms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producer_id' })
  producer: Producer;

  @OneToMany(() => PlantedCrop, (plantedCrop) => plantedCrop.farm)
  plantedCrops: PlantedCrop[];
}
