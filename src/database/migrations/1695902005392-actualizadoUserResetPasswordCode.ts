import { MigrationInterface, QueryRunner } from "typeorm";

export class ActualizadoUserResetPasswordCode1695902005392 implements MigrationInterface {
    name = 'ActualizadoUserResetPasswordCode1695902005392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "reset_password_code" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "reset_password_code"`);
    }

}
