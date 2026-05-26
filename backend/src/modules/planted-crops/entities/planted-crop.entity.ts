import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Farm } from '../../farms/entities/farm.entity';
import { Harvest } from '../../harvests/entities/harvest.entity';
import { CropType } from '../../crop-types/entities/crop-type.entity';

@Entity('culturas_plantadas')
@Unique(['farm', 'harvest', 'cropType'])
export class PlantedCrop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @Column({ name: 'harvest_id', type: 'uuid' })
  harvestId: string;

  @Column({ name: 'crop_type_id', type: 'uuid' })
  cropTypeId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Farm, (farm) => farm.plantedCrops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @ManyToOne(() => Harvest, (harvest) => harvest.plantedCrops)
  @JoinColumn({ name: 'harvest_id' })
  harvest: Harvest;

  @ManyToOne(() => CropType, (cropType) => cropType.plantedCrops)
  @JoinColumn({ name: 'crop_type_id' })
  cropType: CropType;
}
