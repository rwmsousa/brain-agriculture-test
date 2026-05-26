import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHarvestsAndCropTypesTable1700000000003 implements MigrationInterface {
  name = 'CreateHarvestsAndCropTypesTable1700000000003';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "safras" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" VARCHAR(100) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_safras" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tipos_cultura" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" VARCHAR(100) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_tipos_cultura_name" UNIQUE ("name"),
        CONSTRAINT "PK_tipos_cultura" PRIMARY KEY ("id")
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tipos_cultura"`);
    await queryRunner.query(`DROP TABLE "safras"`);
  }
}
