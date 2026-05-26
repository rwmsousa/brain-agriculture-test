import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlantedCropsTable004 implements MigrationInterface {
  name = 'CreatePlantedCropsTable004';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "culturas_plantadas" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "farm_id" UUID NOT NULL,
        "harvest_id" UUID NOT NULL,
        "crop_type_id" UUID NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_culturas_plantadas" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_culturas_plantadas_farm_harvest_crop" UNIQUE ("farm_id", "harvest_id", "crop_type_id"),
        CONSTRAINT "FK_culturas_plantadas_fazenda" FOREIGN KEY ("farm_id")
          REFERENCES "fazendas"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_culturas_plantadas_safra" FOREIGN KEY ("harvest_id")
          REFERENCES "safras"("id"),
        CONSTRAINT "FK_culturas_plantadas_tipo_cultura" FOREIGN KEY ("crop_type_id")
          REFERENCES "tipos_cultura"("id")
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "culturas_plantadas"`);
  }
}
