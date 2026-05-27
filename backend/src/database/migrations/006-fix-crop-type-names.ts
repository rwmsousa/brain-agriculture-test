import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Corrige os nomes dos tipos de cultura que foram inseridos sem acentuação.
 * Cafe → Café | Cana de Acucar → Cana de Açúcar | Algodao → Algodão
 */
export class FixCropTypeNames1700000000006 implements MigrationInterface {
  name = 'FixCropTypeNames1700000000006';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "tipos_cultura" SET "name" = 'Café'          WHERE "name" = 'Cafe'`,
    );
    await queryRunner.query(
      `UPDATE "tipos_cultura" SET "name" = 'Cana de Açúcar' WHERE "name" = 'Cana de Acucar'`,
    );
    await queryRunner.query(
      `UPDATE "tipos_cultura" SET "name" = 'Algodão'        WHERE "name" = 'Algodao'`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "tipos_cultura" SET "name" = 'Cafe'           WHERE "name" = 'Café'`,
    );
    await queryRunner.query(
      `UPDATE "tipos_cultura" SET "name" = 'Cana de Acucar' WHERE "name" = 'Cana de Açúcar'`,
    );
    await queryRunner.query(
      `UPDATE "tipos_cultura" SET "name" = 'Algodao'        WHERE "name" = 'Algodão'`,
    );
  }
}
