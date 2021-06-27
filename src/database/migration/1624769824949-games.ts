import {MigrationInterface, QueryRunner} from "typeorm";

export class games1624769824949 implements MigrationInterface {
    name = 'games1624769824949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "games" ("id" SERIAL NOT NULL, "title" character varying(80) NOT NULL, "description" text NOT NULL, "image_name" character varying(50) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_c26f4ceea870c6b52d767c2e24f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_c26f4ceea870c6b52d767c2e24f"`);
        await queryRunner.query(`DROP TABLE "games"`);
    }

}
