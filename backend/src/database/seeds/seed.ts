import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Producer } from '../../modules/producers/entities/producer.entity';
import { Farm } from '../../modules/farms/entities/farm.entity';
import { Harvest } from '../../modules/harvests/entities/harvest.entity';
import { CropType } from '../../modules/crop-types/entities/crop-type.entity';
import { PlantedCrop } from '../../modules/planted-crops/entities/planted-crop.entity';
import { stripDocument, validateCPF } from '../../common/validators/cpf-cnpj.validator';
import { buildProducer } from './factories/producer.factory';
import { buildFarm } from './factories/farm.factory';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'brain',
  password: process.env.POSTGRES_PASSWORD || 'agriculture',
  database: process.env.POSTGRES_DB || 'brain_agriculture',
  synchronize: false,
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  entities: [Producer, Farm, Harvest, CropType, PlantedCrop],
});

const STATES_DISTRIBUTION = ['MT', 'GO', 'SP', 'MG', 'PR', 'RS', 'BA'];
const CROP_TYPES = ['Soja', 'Milho', 'Cafe', 'Cana de Acucar', 'Algodao'];
const HARVESTS = ['Safra 2023', 'Safra 2024'];

async function seed() {
  await dataSource.initialize();
  console.log('[SEED] Database connection established.');

  const producerRepo = dataSource.getRepository(Producer);
  const farmRepo = dataSource.getRepository(Farm);
  const harvestRepo = dataSource.getRepository(Harvest);
  const cropTypeRepo = dataSource.getRepository(CropType);
  const plantedCropRepo = dataSource.getRepository(PlantedCrop);

  // Seed harvests
  const harvestEntities: Harvest[] = [];
  for (const harvestName of HARVESTS) {
    let harvest = await harvestRepo.findOne({ where: { name: harvestName } });
    if (!harvest) {
      harvest = harvestRepo.create({ name: harvestName });
      harvest = await harvestRepo.save(harvest);
      console.log(`[SEED] Harvest created: ${harvestName}`);
    } else {
      console.log(`[SEED] Harvest already exists: ${harvestName}`);
    }
    harvestEntities.push(harvest);
  }

  // Seed crop types
  const cropTypeEntities: CropType[] = [];
  for (const cropTypeName of CROP_TYPES) {
    let cropType = await cropTypeRepo.findOne({ where: { name: cropTypeName } });
    if (!cropType) {
      cropType = cropTypeRepo.create({ name: cropTypeName });
      cropType = await cropTypeRepo.save(cropType);
      console.log(`[SEED] CropType created: ${cropTypeName}`);
    } else {
      console.log(`[SEED] CropType already exists: ${cropTypeName}`);
    }
    cropTypeEntities.push(cropType);
  }

  // Seed 5 producers with farms and planted crops
  for (let i = 0; i < 5; i++) {
    const producerData = buildProducer(i);
    const stripped = stripDocument(producerData.document);

    if (!validateCPF(stripped)) {
      console.error(`[SEED] Invalid CPF for producer ${i}: ${stripped}`);
      continue;
    }

    let producer = await producerRepo.findOne({ where: { document: stripped } });
    if (!producer) {
      producer = producerRepo.create({
        document: stripped,
        documentType: producerData.documentType,
        name: producerData.name,
      });
      producer = await producerRepo.save(producer);
      console.log(`[SEED] Producer created: ${producer.name} (${stripped})`);
    } else {
      console.log(`[SEED] Producer already exists: ${producer.name}`);
    }

    // Create 1-3 farms per producer
    const farmCount = (i % 3) + 1;
    for (let j = 0; j < farmCount; j++) {
      const state = STATES_DISTRIBUTION[(i + j) % STATES_DISTRIBUTION.length];
      const farmData = buildFarm(producer.id, state, j);

      const existingFarm = await farmRepo.findOne({
        where: { producerId: producer.id, name: farmData.name },
      });

      let farm: Farm;
      if (!existingFarm) {
        farm = farmRepo.create({
          producerId: producer.id,
          name: farmData.name,
          city: farmData.city,
          state: farmData.state,
          totalAreaHectares: farmData.totalAreaHectares,
          arableAreaHectares: farmData.arableAreaHectares,
          vegetationAreaHectares: farmData.vegetationAreaHectares,
        });
        farm = await farmRepo.save(farm);
        console.log(`[SEED] Farm created: ${farm.name} (${state})`);
      } else {
        farm = existingFarm;
        console.log(`[SEED] Farm already exists: ${existingFarm.name}`);
      }

      // Add 2-3 planted crops per farm
      const cropCount = (j % 2) + 2;
      for (let k = 0; k < cropCount; k++) {
        const cropType = cropTypeEntities[k % cropTypeEntities.length];
        const harvest = harvestEntities[k % harvestEntities.length];

        const existingPlantedCrop = await plantedCropRepo.findOne({
          where: { farmId: farm.id, harvestId: harvest.id, cropTypeId: cropType.id },
        });

        if (!existingPlantedCrop) {
          const plantedCrop = plantedCropRepo.create({
            farmId: farm.id,
            harvestId: harvest.id,
            cropTypeId: cropType.id,
          });
          await plantedCropRepo.save(plantedCrop);
          console.log(
            `[SEED] PlantedCrop created: ${cropType.name} on ${farm.name} (${harvest.name})`,
          );
        } else {
          console.log(`[SEED] PlantedCrop already exists: ${cropType.name} on ${farm.name}`);
        }
      }
    }
  }

  console.log('[SEED] Seeding complete!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('[SEED] Error:', error);
  process.exit(1);
});
