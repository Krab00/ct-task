import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateShipmentItems1754602262774 implements MigrationInterface {
    name = 'CreateShipmentItems1754602262774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`shipment_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`unitPrice\` decimal(10,2) NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL, \`shipmentId\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`shipment_items\` ADD CONSTRAINT \`FK_eeef177e88218449410bbb3af44\` FOREIGN KEY (\`shipmentId\`) REFERENCES \`shipments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shipment_items\` ADD CONSTRAINT \`FK_4adc7d31b2e34803fb8b0d7ec7f\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipment_items\` DROP FOREIGN KEY \`FK_4adc7d31b2e34803fb8b0d7ec7f\``);
        await queryRunner.query(`ALTER TABLE \`shipment_items\` DROP FOREIGN KEY \`FK_eeef177e88218449410bbb3af44\``);
        await queryRunner.query(`DROP TABLE \`shipment_items\``);
    }

}
