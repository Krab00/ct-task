import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialTables1754518071865 implements MigrationInterface {
    name = 'InitialTables1754518071865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`sku\` varchar(50) NOT NULL, \`name\` varchar(255) NOT NULL, \`quantity\` int NOT NULL DEFAULT '0', \`unitPrice\` decimal(10,2) NOT NULL, UNIQUE INDEX \`IDX_c44ac33a05b144dd0d9ddcf932\` (\`sku\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`unitPrice\` decimal(10,2) NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL, \`orderId\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customer_orders\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`orderId\` int NOT NULL AUTO_INCREMENT, \`customerName\` varchar(255) NOT NULL, \`customerEmail\` varchar(255) NOT NULL, \`status\` enum ('pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending', \`totalAmount\` decimal(10,2) NOT NULL, \`notes\` text NULL, UNIQUE INDEX \`IDX_934a746287c774ea278519a990\` (\`orderId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shipments\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`recipientName\` varchar(255) NOT NULL, \`recipientAddress\` varchar(255) NOT NULL, \`recipientCity\` varchar(100) NOT NULL, \`recipientPostalCode\` varchar(20) NOT NULL, \`recipientCountry\` varchar(100) NOT NULL, \`status\` enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending', \`trackingNumber\` varchar(255) NULL, \`carrier\` varchar(100) NULL, \`notes\` text NULL, \`shippedAt\` datetime NULL, \`deliveredAt\` datetime NULL, \`orderId\` varchar(255) NOT NULL, \`orderNumber\` int NULL, UNIQUE INDEX \`REL_13ba957bcb616719a0dc3fca82\` (\`orderId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_f1d359a55923bb45b057fbdab0d\` FOREIGN KEY (\`orderId\`) REFERENCES \`customer_orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_cdb99c05982d5191ac8465ac010\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shipments\` ADD CONSTRAINT \`FK_13ba957bcb616719a0dc3fca82f\` FOREIGN KEY (\`orderId\`) REFERENCES \`customer_orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipments\` DROP FOREIGN KEY \`FK_13ba957bcb616719a0dc3fca82f\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_cdb99c05982d5191ac8465ac010\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_f1d359a55923bb45b057fbdab0d\``);
        await queryRunner.query(`DROP INDEX \`REL_13ba957bcb616719a0dc3fca82\` ON \`shipments\``);
        await queryRunner.query(`DROP TABLE \`shipments\``);
        await queryRunner.query(`DROP INDEX \`IDX_934a746287c774ea278519a990\` ON \`customer_orders\``);
        await queryRunner.query(`DROP TABLE \`customer_orders\``);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP INDEX \`IDX_c44ac33a05b144dd0d9ddcf932\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
