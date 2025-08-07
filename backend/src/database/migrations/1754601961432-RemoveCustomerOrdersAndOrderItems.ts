import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCustomerOrdersAndOrderItems1754601961432 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`order_items\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`customer_orders\``);
        await queryRunner.query(`ALTER TABLE \`shipments\` DROP INDEX \`REL_13ba957bcb616719a0dc3fca82\``);
        await queryRunner.query(`ALTER TABLE \`shipments\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`shipments\` DROP COLUMN \`orderNumber\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipments\` ADD \`orderId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shipments\` ADD \`orderNumber\` int NULL`);
        await queryRunner.query(`CREATE TABLE \`customer_orders\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`orderId\` int NOT NULL AUTO_INCREMENT, \`customerName\` varchar(255) NOT NULL, \`customerEmail\` varchar(255) NOT NULL, \`status\` enum ('pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending', \`totalAmount\` decimal(10,2) NOT NULL, \`notes\` text NULL, UNIQUE INDEX \`IDX_934a746287c774ea278519a990\` (\`orderId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`unitPrice\` decimal(10,2) NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL, \`orderId\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_f1d359a55923bb45b057fbdab0d\` FOREIGN KEY (\`orderId\`) REFERENCES \`customer_orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shipments\` ADD CONSTRAINT \`FK_13ba957bcb616719a0dc3fca82f\` FOREIGN KEY (\`orderId\`) REFERENCES \`customer_orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
