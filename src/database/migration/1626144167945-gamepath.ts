import {MigrationInterface, QueryRunner} from "typeorm";

export class gamepath1626144167945 implements MigrationInterface {
    name = 'gamepath1626144167945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "image_path" character varying(250) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "image_path"`);
    }

}
