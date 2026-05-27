import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PlantedCrop } from '../../planted-crops/entities/planted-crop.entity';

@Entity('tipos_cultura')
export class CropType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => PlantedCrop, (plantedCrop) => plantedCrop.cropType)
  plantedCrops: PlantedCrop[];
}
