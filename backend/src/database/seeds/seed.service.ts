import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CropType } from '../../modules/crop-types/entities/crop-type.entity';
import { Farm } from '../../modules/farms/entities/farm.entity';
import { Harvest } from '../../modules/harvests/entities/harvest.entity';
import { PlantedCrop } from '../../modules/planted-crops/entities/planted-crop.entity';
import { Producer } from '../../modules/producers/entities/producer.entity';
import { stripDocument } from '../../common/validators/cpf-cnpj.validator';
import { buildFarm } from './factories/farm.factory';
import { buildProducer } from './factories/producer.factory';

const STATES_DISTRIBUTION = ['MT', 'GO', 'SP', 'MG', 'PR', 'RS', 'BA'];
const CROP_TYPES = ['Soja', 'Milho', 'Cafe', 'Cana de Acucar', 'Algodao'];
const HARVESTS = ['Safra 2023', 'Safra 2024'];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Producer) private readonly producerRepo: Repository<Producer>,
    @InjectRepository(Farm) private readonly farmRepo: Repository<Farm>,
    @InjectRepository(Harvest) private readonly harvestRepo: Repository<Harvest>,
    @InjectRepository(CropType) private readonly cropTypeRepo: Repository<CropType>,
    @InjectRepository(PlantedCrop) private readonly plantedCropRepo: Repository<PlantedCrop>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.run();
  }

  async run(): Promise<void> {
    const producerCount = await this.producerRepo.count();
    if (producerCount > 0) {
      this.logger.log('Dados já existem no banco, seed ignorado.');
      return;
    }

    this.logger.log('Iniciando seed do banco de dados...');

    const harvestEntities = await this.seedHarvests();
    const cropTypeEntities = await this.seedCropTypes();
    await this.seedProducers(harvestEntities, cropTypeEntities);

    this.logger.log('Seed concluído com sucesso!');
  }

  private async seedHarvests(): Promise<Harvest[]> {
    const entities: Harvest[] = [];
    for (const name of HARVESTS) {
      let harvest = await this.harvestRepo.findOne({ where: { name } });
      if (!harvest) {
        harvest = await this.harvestRepo.save(this.harvestRepo.create({ name }));
        this.logger.log(`Safra criada: ${name}`);
      }
      entities.push(harvest);
    }
    return entities;
  }

  private async seedCropTypes(): Promise<CropType[]> {
    const entities: CropType[] = [];
    for (const name of CROP_TYPES) {
      let cropType = await this.cropTypeRepo.findOne({ where: { name } });
      if (!cropType) {
        cropType = await this.cropTypeRepo.save(this.cropTypeRepo.create({ name }));
        this.logger.log(`Tipo de cultura criado: ${name}`);
      }
      entities.push(cropType);
    }
    return entities;
  }

  private async seedProducers(harvests: Harvest[], cropTypes: CropType[]): Promise<void> {
    for (let i = 0; i < 5; i++) {
      const producerData = buildProducer(i);
      const document = stripDocument(producerData.document);

      let producer = await this.producerRepo.findOne({ where: { document } });
      if (!producer) {
        producer = await this.producerRepo.save(
          this.producerRepo.create({
            document,
            documentType: producerData.documentType,
            name: producerData.name,
          }),
        );
        this.logger.log(`Produtor criado: ${producer.name}`);
      }

      await this.seedFarms(producer, i, harvests, cropTypes);
    }
  }

  private async seedFarms(
    producer: Producer,
    producerIndex: number,
    harvests: Harvest[],
    cropTypes: CropType[],
  ): Promise<void> {
    const farmCount = (producerIndex % 3) + 1;
    for (let j = 0; j < farmCount; j++) {
      const state = STATES_DISTRIBUTION[(producerIndex + j) % STATES_DISTRIBUTION.length];
      const farmData = buildFarm(producer.id, state, j);

      let farm = await this.farmRepo.findOne({
        where: { producerId: producer.id, name: farmData.name },
      });

      if (!farm) {
        farm = await this.farmRepo.save(
          this.farmRepo.create({
            producerId: producer.id,
            name: farmData.name,
            city: farmData.city,
            state: farmData.state,
            totalAreaHectares: farmData.totalAreaHectares,
            arableAreaHectares: farmData.arableAreaHectares,
            vegetationAreaHectares: farmData.vegetationAreaHectares,
          }),
        );
        this.logger.log(`Fazenda criada: ${farm.name} (${state})`);
      }

      await this.seedPlantedCrops(farm, j, harvests, cropTypes);
    }
  }

  private async seedPlantedCrops(
    farm: Farm,
    farmIndex: number,
    harvests: Harvest[],
    cropTypes: CropType[],
  ): Promise<void> {
    const cropCount = (farmIndex % 2) + 2;
    for (let k = 0; k < cropCount; k++) {
      const cropType = cropTypes[k % cropTypes.length];
      const harvest = harvests[k % harvests.length];

      const existing = await this.plantedCropRepo.findOne({
        where: { farmId: farm.id, harvestId: harvest.id, cropTypeId: cropType.id },
      });

      if (!existing) {
        await this.plantedCropRepo.save(
          this.plantedCropRepo.create({
            farmId: farm.id,
            harvestId: harvest.id,
            cropTypeId: cropType.id,
          }),
        );
      }
    }
  }
}
