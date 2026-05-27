import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PlantedCrop } from '../../planted-crops/entities/planted-crop.entity';

@Entity('safras')
export class Harvest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => PlantedCrop, (plantedCrop) => plantedCrop.harvest)
  plantedCrops: PlantedCrop[];
}
