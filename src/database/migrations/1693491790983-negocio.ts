import { MigrationInterface, QueryRunner } from "typeorm";

export class Negocio1693491790983 implements MigrationInterface {
    name = 'Negocio1693491790983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mod_nomenclator"."nom_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_d15de517f5b0327141a7e57fc3b" UNIQUE ("name"), CONSTRAINT "UQ_d15de517f5b0327141a7e57fc3b" UNIQUE ("name"), CONSTRAINT "PK_ad3fce65a90bc6b71c24a43c64d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "description" text NOT NULL, "price" double precision NOT NULL, "amount" integer NOT NULL, "homeService" boolean NOT NULL, "business_id" uuid, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_nomenclator"."nom_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_4a6e2d8ce2efc8f93d68f44bd7f" UNIQUE ("name"), CONSTRAINT "UQ_4a6e2d8ce2efc8f93d68f44bd7f" UNIQUE ("name"), CONSTRAINT "PK_0f461c3327ed8d05ee68d7e1f7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(25) NOT NULL, "price" double precision, CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab" UNIQUE ("name"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "lastname" character varying(255) NOT NULL, "age" integer NOT NULL, "sex" character varying(255) NOT NULL, "ci" character varying(11) NOT NULL, "addressClient" character varying(255) NOT NULL, "municipality_id" uuid, CONSTRAINT "UQ_480f88a019346eae487a0cd7f0c" UNIQUE ("name"), CONSTRAINT "UQ_b0ef3fa4caeec3c23a55eceeb8a" UNIQUE ("lastname"), CONSTRAINT "UQ_bf46f19067f5138aa6b8054da45" UNIQUE ("ci"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "business" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "addressBusiness" character varying(255) NOT NULL, "municipality_id" uuid, CONSTRAINT "UQ_c6894e962b80bc10a694c0271e2" UNIQUE ("name"), CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_municipality" ("product_id" uuid NOT NULL, "municipality_id" uuid NOT NULL, CONSTRAINT "PK_3fe8d2efe23a385b97311e7dffb" PRIMARY KEY ("product_id", "municipality_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7ffaf5ba76a9eb51783852ade7" ON "product_municipality" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f173ae78ee48f42c17350dcc96" ON "product_municipality" ("municipality_id") `);
        await queryRunner.query(`CREATE TABLE "product_province" ("product_id" uuid NOT NULL, "province_id" uuid NOT NULL, CONSTRAINT "PK_5ae4cb88d97b9b455e65a2c1fdd" PRIMARY KEY ("product_id", "province_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_affeadc13a1776cd6b1f893361" ON "product_province" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4652e5eed12217a2d68ba297ec" ON "product_province" ("province_id") `);
        await queryRunner.query(`CREATE TABLE "product_tag" ("product_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_5e6a58e9623ea046dbe0a1d43da" PRIMARY KEY ("product_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d08cb260c60a9bf0a5e0424768" ON "product_tag" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7bf0b673c19b33c9456d54b2b3" ON "product_tag" ("tag_id") `);
        await queryRunner.query(`CREATE TABLE "plan_permission" ("plan_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_20f71911ec3eff6f56e2fc306b9" PRIMARY KEY ("plan_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ab5847be92a8e95dc8ee3605a7" ON "plan_permission" ("plan_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e07c4d187159336cfb9988f4cb" ON "plan_permission" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "phone" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "expire" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "plan_id" uuid`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "province_id" uuid`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "municipality_id" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_7619769f4c871d92f9531ea1688" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_50d2f8e286975d06a2238f2f69a" FOREIGN KEY ("municipality_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD CONSTRAINT "FK_aa22a94c276c9921fe6590c1557" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD CONSTRAINT "FK_7d00b75aed2308608f48945d5fc" FOREIGN KEY ("province_id") REFERENCES "mod_dpa"."province"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD CONSTRAINT "FK_3963c7765b13874e9eeede0eae9" FOREIGN KEY ("municipality_id") REFERENCES "mod_dpa"."municipality"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "FK_2c552de2547d69a499d824f583d" FOREIGN KEY ("municipality_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_municipality" ADD CONSTRAINT "FK_7ffaf5ba76a9eb51783852ade70" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_municipality" ADD CONSTRAINT "FK_f173ae78ee48f42c17350dcc965" FOREIGN KEY ("municipality_id") REFERENCES "mod_dpa"."municipality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_province" ADD CONSTRAINT "FK_affeadc13a1776cd6b1f893361d" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_province" ADD CONSTRAINT "FK_4652e5eed12217a2d68ba297ec1" FOREIGN KEY ("province_id") REFERENCES "mod_dpa"."province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD CONSTRAINT "FK_d08cb260c60a9bf0a5e0424768d" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD CONSTRAINT "FK_7bf0b673c19b33c9456d54b2b37" FOREIGN KEY ("tag_id") REFERENCES "mod_nomenclator"."nom_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_permission" ADD CONSTRAINT "FK_ab5847be92a8e95dc8ee3605a7e" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "plan_permission" ADD CONSTRAINT "FK_e07c4d187159336cfb9988f4cb9" FOREIGN KEY ("permission_id") REFERENCES "mod_nomenclator"."nom_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_permission" DROP CONSTRAINT "FK_e07c4d187159336cfb9988f4cb9"`);
        await queryRunner.query(`ALTER TABLE "plan_permission" DROP CONSTRAINT "FK_ab5847be92a8e95dc8ee3605a7e"`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP CONSTRAINT "FK_7bf0b673c19b33c9456d54b2b37"`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP CONSTRAINT "FK_d08cb260c60a9bf0a5e0424768d"`);
        await queryRunner.query(`ALTER TABLE "product_province" DROP CONSTRAINT "FK_4652e5eed12217a2d68ba297ec1"`);
        await queryRunner.query(`ALTER TABLE "product_province" DROP CONSTRAINT "FK_affeadc13a1776cd6b1f893361d"`);
        await queryRunner.query(`ALTER TABLE "product_municipality" DROP CONSTRAINT "FK_f173ae78ee48f42c17350dcc965"`);
        await queryRunner.query(`ALTER TABLE "product_municipality" DROP CONSTRAINT "FK_7ffaf5ba76a9eb51783852ade70"`);
        await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_2c552de2547d69a499d824f583d"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP CONSTRAINT "FK_3963c7765b13874e9eeede0eae9"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP CONSTRAINT "FK_7d00b75aed2308608f48945d5fc"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP CONSTRAINT "FK_aa22a94c276c9921fe6590c1557"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_50d2f8e286975d06a2238f2f69a"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_7619769f4c871d92f9531ea1688"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "municipality_id"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "province_id"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "plan_id"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "expire"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "phone"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e07c4d187159336cfb9988f4cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab5847be92a8e95dc8ee3605a7"`);
        await queryRunner.query(`DROP TABLE "plan_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7bf0b673c19b33c9456d54b2b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d08cb260c60a9bf0a5e0424768"`);
        await queryRunner.query(`DROP TABLE "product_tag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4652e5eed12217a2d68ba297ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_affeadc13a1776cd6b1f893361"`);
        await queryRunner.query(`DROP TABLE "product_province"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f173ae78ee48f42c17350dcc96"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ffaf5ba76a9eb51783852ade7"`);
        await queryRunner.query(`DROP TABLE "product_municipality"`);
        await queryRunner.query(`DROP TABLE "business"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TABLE "mod_nomenclator"."nom_permission"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "mod_nomenclator"."nom_tag"`);
    }

}
