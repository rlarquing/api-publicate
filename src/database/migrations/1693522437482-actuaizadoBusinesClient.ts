import { MigrationInterface, QueryRunner } from "typeorm";

export class ActuaizadoBusinesClient1693522437482 implements MigrationInterface {
    name = 'ActuaizadoBusinesClient1693522437482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_50d2f8e286975d06a2238f2f69a"`);
        await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_2c552de2547d69a499d824f583d"`);
        await queryRunner.query(`ALTER TABLE "client" RENAME COLUMN "municipality_id" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "business" RENAME COLUMN "municipality_id" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_f18a6fabea7b2a90ab6bf10a650" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "FK_025c140802a1d898b434f7ee17d" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_025c140802a1d898b434f7ee17d"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_f18a6fabea7b2a90ab6bf10a650"`);
        await queryRunner.query(`ALTER TABLE "business" RENAME COLUMN "user_id" TO "municipality_id"`);
        await queryRunner.query(`ALTER TABLE "client" RENAME COLUMN "user_id" TO "municipality_id"`);
        await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "FK_2c552de2547d69a499d824f583d" FOREIGN KEY ("municipality_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_50d2f8e286975d06a2238f2f69a" FOREIGN KEY ("municipality_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
