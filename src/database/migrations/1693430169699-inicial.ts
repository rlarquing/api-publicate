import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1693430169699 implements MigrationInterface {
    name = 'Inicial1693430169699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mod_auth"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "username" character varying(25) NOT NULL, "email" character varying, "password" character varying NOT NULL, "refreshtoken" character varying, "refreshtokenexp" date, "salt" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."rol" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_642b883443b82d52f4ba99589c9" UNIQUE ("name"), CONSTRAINT "PK_c93a22388638fac311781c7f2dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "label" character varying(255) NOT NULL, "icon" character varying(255) NOT NULL, "to" character varying(255) NOT NULL, "tipo" character varying(255) NOT NULL DEFAULT 'interno', "nomemclador" character varying(255), "menu_id" uuid, CONSTRAINT "UQ_ff803fc14e062ad17d2f15862cc" UNIQUE ("nomemclador"), CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."function" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "nombre" character varying(255) NOT NULL, "descripcion" character varying(255) NOT NULL, "menu_id" uuid, CONSTRAINT "REL_77dee58171ace861811311d6ce" UNIQUE ("menu_id"), CONSTRAINT "PK_6e085d059b4227aab09e8a5b05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."end_point" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "controller" character varying(255) NOT NULL, "servicio" character varying(255) NOT NULL, "ruta" character varying(255) NOT NULL, "nombre" character varying(255) NOT NULL, "metodo" character varying(255) NOT NULL, CONSTRAINT "PK_62caa5cb09b6ec54455dabb69cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_dpa"."province" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_dpa"."municipality" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "province_id" uuid, CONSTRAINT "PK_281ad341f20df7c41b83a182e2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."traza" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP DEFAULT now(), "model" character varying NOT NULL, "data" jsonb, "action" character varying NOT NULL, "record" integer, "user_id" uuid, CONSTRAINT "PK_9c9e2df5aa69e52f3ef752c801c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."user_rol" ("user_id" uuid NOT NULL, "rol_id" uuid NOT NULL, CONSTRAINT "PK_7cf100d94c639983ce7a545526f" PRIMARY KEY ("user_id", "rol_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_46dc4d18f715459d7bf682d32b" ON "mod_auth"."user_rol" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e959bd66b9f5a8c77de4fd589e" ON "mod_auth"."user_rol" ("rol_id") `);
        await queryRunner.query(`CREATE TABLE "mod_auth"."user_funcion" ("user_id" uuid NOT NULL, "funcion_id" uuid NOT NULL, CONSTRAINT "PK_fe11cc91f4d6799b60d91973857" PRIMARY KEY ("user_id", "funcion_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_074ceeadf723390b0fb9f582a5" ON "mod_auth"."user_funcion" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_171ab157447420f1284a8a45d6" ON "mod_auth"."user_funcion" ("funcion_id") `);
        await queryRunner.query(`CREATE TABLE "mod_auth"."rol_funcion" ("rol_id" uuid NOT NULL, "funcion_id" uuid NOT NULL, CONSTRAINT "PK_52aa46684e8437845bb0ac020cd" PRIMARY KEY ("rol_id", "funcion_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dd96b3b407b3a5c35195993c16" ON "mod_auth"."rol_funcion" ("rol_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_273f59cc606dc3d818235f0879" ON "mod_auth"."rol_funcion" ("funcion_id") `);
        await queryRunner.query(`CREATE TABLE "mod_auth"."funcion_end_point" ("funcion_id" uuid NOT NULL, "end_point_id" uuid NOT NULL, CONSTRAINT "PK_8fc8e29994daeffefecf9adcd4e" PRIMARY KEY ("funcion_id", "end_point_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8d632ce50f972ad8f58ea565c7" ON "mod_auth"."funcion_end_point" ("funcion_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1d991de75805208749c0407ee" ON "mod_auth"."funcion_end_point" ("end_point_id") `);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_237a0fe43278378e9c5729d17af" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."function" ADD CONSTRAINT "FK_77dee58171ace861811311d6cec" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipality" ADD CONSTRAINT "FK_483c51de02d90702f5acb0ddfcd" FOREIGN KEY ("province_id") REFERENCES "mod_dpa"."province"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" ADD CONSTRAINT "FK_007b58c37691032e6366f27de7c" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" ADD CONSTRAINT "FK_46dc4d18f715459d7bf682d32b9" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" ADD CONSTRAINT "FK_e959bd66b9f5a8c77de4fd589eb" FOREIGN KEY ("rol_id") REFERENCES "mod_auth"."rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_funcion" ADD CONSTRAINT "FK_074ceeadf723390b0fb9f582a5d" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_funcion" ADD CONSTRAINT "FK_171ab157447420f1284a8a45d65" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."function"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_funcion" ADD CONSTRAINT "FK_dd96b3b407b3a5c35195993c16a" FOREIGN KEY ("rol_id") REFERENCES "mod_auth"."rol"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_funcion" ADD CONSTRAINT "FK_273f59cc606dc3d818235f08796" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."function"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" ADD CONSTRAINT "FK_8d632ce50f972ad8f58ea565c74" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."function"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" ADD CONSTRAINT "FK_a1d991de75805208749c0407ee5" FOREIGN KEY ("end_point_id") REFERENCES "mod_auth"."end_point"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" DROP CONSTRAINT "FK_a1d991de75805208749c0407ee5"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" DROP CONSTRAINT "FK_8d632ce50f972ad8f58ea565c74"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_funcion" DROP CONSTRAINT "FK_273f59cc606dc3d818235f08796"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_funcion" DROP CONSTRAINT "FK_dd96b3b407b3a5c35195993c16a"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_funcion" DROP CONSTRAINT "FK_171ab157447420f1284a8a45d65"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_funcion" DROP CONSTRAINT "FK_074ceeadf723390b0fb9f582a5d"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" DROP CONSTRAINT "FK_e959bd66b9f5a8c77de4fd589eb"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" DROP CONSTRAINT "FK_46dc4d18f715459d7bf682d32b9"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" DROP CONSTRAINT "FK_007b58c37691032e6366f27de7c"`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipality" DROP CONSTRAINT "FK_483c51de02d90702f5acb0ddfcd"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."function" DROP CONSTRAINT "FK_77dee58171ace861811311d6cec"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_237a0fe43278378e9c5729d17af"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_a1d991de75805208749c0407ee"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_8d632ce50f972ad8f58ea565c7"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."funcion_end_point"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_273f59cc606dc3d818235f0879"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_dd96b3b407b3a5c35195993c16"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."rol_funcion"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_171ab157447420f1284a8a45d6"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_074ceeadf723390b0fb9f582a5"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."user_funcion"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_e959bd66b9f5a8c77de4fd589e"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_46dc4d18f715459d7bf682d32b"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."user_rol"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."traza"`);
        await queryRunner.query(`DROP TABLE "mod_dpa"."municipality"`);
        await queryRunner.query(`DROP TABLE "mod_dpa"."province"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."end_point"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."function"`);
        await queryRunner.query(`DROP TABLE "menu"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."rol"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."user"`);
    }

}
