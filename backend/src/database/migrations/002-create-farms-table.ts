import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFarmsTable002 implements MigrationInterface {
  name = 'CreateFarmsTable002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "fazendas" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "producer_id" UUID NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "city" VARCHAR(255) NOT NULL,
        "state" CHAR(2) NOT NULL,
        "total_area_hectares" DECIMAL(12,4) NOT NULL,
        "arable_area_hectares" DECIMAL(12,4) NOT NULL,
        "vegetation_area_hectares" DECIMAL(12,4) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fazendas" PRIMARY KEY ("id"),
        CONSTRAINT "FK_fazendas_produtor" FOREIGN KEY ("producer_id")
          REFERENCES "produtores"("id") ON DELETE CASCADE
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "fazendas"`);
  }
}
