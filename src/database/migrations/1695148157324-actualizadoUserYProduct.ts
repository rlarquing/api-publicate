import { MigrationInterface, QueryRunner } from "typeorm";

export class ActualizadoUserYProduct1695148157324 implements MigrationInterface {
    name = 'ActualizadoUserYProduct1695148157324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "url" text NOT NULL, "product_id" uuid, CONSTRAINT "UQ_e4dfc6a6f95452c9c931f5df487" UNIQUE ("name"), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ALTER COLUMN "expire" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_e6a9e829e17fc47fc17d695af8e" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_e6a9e829e17fc47fc17d695af8e"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ALTER COLUMN "expire" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
