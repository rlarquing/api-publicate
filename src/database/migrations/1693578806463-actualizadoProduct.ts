import { MigrationInterface, QueryRunner } from "typeorm";

export class ActualizadoProduct1693578806463 implements MigrationInterface {
    name = 'ActualizadoProduct1693578806463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "homeService" TO "home_service"`);
        await queryRunner.query(`ALTER TABLE "business" RENAME COLUMN "addressBusiness" TO "address_business"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "UQ_b0ef3fa4caeec3c23a55eceeb8a"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "lastname"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "addressClient"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "last_name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "UQ_735edd1397f4001ea57d8f73b64" UNIQUE ("last_name")`);
        await queryRunner.query(`ALTER TABLE "client" ADD "address_client" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "address_client"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "UQ_735edd1397f4001ea57d8f73b64"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "addressClient" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "lastname" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "UQ_b0ef3fa4caeec3c23a55eceeb8a" UNIQUE ("lastname")`);
        await queryRunner.query(`ALTER TABLE "business" RENAME COLUMN "address_business" TO "addressBusiness"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "home_service" TO "homeService"`);
    }

}
