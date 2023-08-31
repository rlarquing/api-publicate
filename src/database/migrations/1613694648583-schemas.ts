import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchemas1613694648583 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS mod_nomenclator`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS mod_auth`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS mod_dpa`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS mod_nomenclator`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS mod_auth`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS mod_dpa`);
  }
}
