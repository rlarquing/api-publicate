import { MigrationInterface, QueryRunner } from "typeorm";

export class ActualizadoUserCodeActivation1695831619374 implements MigrationInterface {
    name = 'ActualizadoUserCodeActivation1695831619374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "code_activation" integer`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD CONSTRAINT "UQ_142ca08c0f1a6e7a432827a8419" UNIQUE ("code_activation")`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP CONSTRAINT "UQ_142ca08c0f1a6e7a432827a8419"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "code_activation"`);
    }

}
