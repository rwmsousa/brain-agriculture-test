import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducersTable001 implements MigrationInterface {
  name = 'CreateProducersTable001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE "produtores" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "document" VARCHAR(18) NOT NULL,
        "document_type" VARCHAR(4) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_produtores_document" UNIQUE ("document"),
        CONSTRAINT "PK_produtores" PRIMARY KEY ("id")
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "produtores"`);
  }
}
