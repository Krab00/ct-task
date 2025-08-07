import { Entity, Column, OneToMany } from 'typeorm';
import { ShipmentStatus } from './enums/shipment-status';
import { BaseEntity } from './base.entity';
import { ShipmentItemEntity } from './shipment-item.entity';

@Entity({
  name: 'shipments',
  schema: 'warehouse',
})
export class ShipmentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  recipientName: string;

  @Column({ type: 'varchar', length: 255 })
  recipientAddress: string;

  @Column({ type: 'varchar', length: 100 })
  recipientCity: string;

  @Column({ type: 'varchar', length: 20 })
  recipientPostalCode: string;

  @Column({ type: 'varchar', length: 100 })
  recipientCountry: string;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.Pending,
  })
  status: ShipmentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  carrier: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'datetime', nullable: true })
  shippedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt: Date;

  @OneToMany(() => ShipmentItemEntity, shipmentItem => shipmentItem.shipment, {
    cascade: ['soft-remove'],
  })
  items: ShipmentItemEntity[];
}
