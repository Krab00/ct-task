import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { ShipmentEntity } from './shipment.entity';
import { OrderStatus } from './enums/order-status';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'customer_orders',
  schema: 'warehouse',
})
export class OrderEntity extends BaseEntity {
  @Column({ type: 'int', unique: true, generated: 'increment' })
  orderId: number;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => OrderItemEntity, orderItem => orderItem.order, {
    cascade: ['soft-remove'],
  })
  items: OrderItemEntity[];

  @OneToOne(() => ShipmentEntity, shipment => shipment.order)
  shipment: ShipmentEntity;
}
