import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCropTypes1700000000005 implements MigrationInterface {
  name = 'SeedCropTypes1700000000005';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "tipos_cultura" ("name") VALUES
        ('Soja'),
        ('Milho'),
        ('Café'),
        ('Cana de Açúcar'),
        ('Algodão'),
        ('Trigo')
      ON CONFLICT ("name") DO NOTHING
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "tipos_cultura"
      WHERE "name" IN ('Soja', 'Milho', 'Cafe', 'Cana de Acucar', 'Algodao')
    `);
  }
}
