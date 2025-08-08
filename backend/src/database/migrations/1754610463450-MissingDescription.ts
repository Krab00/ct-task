import { MigrationInterface, QueryRunner } from "typeorm";

export class MissingDescription1754610463450 implements MigrationInterface {
    name = 'MissingDescription1754610463450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipments\` DROP FOREIGN KEY \`FK_13ba957bcb616719a0dc3fca82f\``);
        await queryRunner.query(`DROP INDEX \`IDX_13ba957bcb616719a0dc3fca82\` ON \`shipments\``);
        await queryRunner.query(`DROP INDEX \`REL_13ba957bcb616719a0dc3fca82\` ON \`shipments\``);
        await queryRunner.query(`ALTER TABLE \`shipments\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`shipments\` DROP COLUMN \`orderNumber\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`description\` varchar(4000) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`currency\` enum ('EUR') NOT NULL DEFAULT 'EUR'`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`imageUrl\` varchar(500) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`shipments\` ADD \`orderNumber\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shipments\` ADD \`orderId\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_13ba957bcb616719a0dc3fca82\` ON \`shipments\` (\`orderId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_13ba957bcb616719a0dc3fca82\` ON \`shipments\` (\`orderId\`)`);
        await queryRunner.query(`ALTER TABLE \`shipments\` ADD CONSTRAINT \`FK_13ba957bcb616719a0dc3fca82f\` FOREIGN KEY (\`orderId\`) REFERENCES \`customer_orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
