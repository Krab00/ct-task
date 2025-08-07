import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductsTable1754566332887 implements MigrationInterface {
    name = 'UpdateProductsTable1754566332887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`description\` varchar(4000) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`currency\` enum ('EUR') NOT NULL DEFAULT 'EUR'`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`imageUrl\` varchar(500) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`description\``);
    }

}
