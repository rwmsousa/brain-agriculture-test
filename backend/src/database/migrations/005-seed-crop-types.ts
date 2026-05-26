import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCropTypes005 implements MigrationInterface {
  name = 'SeedCropTypes005';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "tipos_cultura" ("name") VALUES
        ('Soja'),
        ('Milho'),
        ('Cafe'),
        ('Cana de Acucar'),
        ('Algodao')
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
