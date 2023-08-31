import { MigrationInterface, QueryRunner } from "typeorm";

export class CambiadoNombreEntidadTraza1693493754756 implements MigrationInterface {
    name = 'CambiadoNombreEntidadTraza1693493754756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mod_auth"."log_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP DEFAULT now(), "model" character varying NOT NULL, "data" jsonb, "action" character varying NOT NULL, "record" character varying(255), "user_id" uuid, CONSTRAINT "PK_837ee3d001208e2b7400e7a0487" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."log_history" ADD CONSTRAINT "FK_f063250e076e266042e30653d41" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."log_history" DROP CONSTRAINT "FK_f063250e076e266042e30653d41"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."log_history"`);
    }

}
