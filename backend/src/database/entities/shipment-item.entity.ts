import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShipmentEntity } from './shipment.entity';
import { ProductEntity } from './product.entity';

@Entity({
  name: 'shipment_items',
  schema: 'warehouse',
})
export class ShipmentItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => ShipmentEntity, shipment => shipment.items, {
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'shipmentId' })
  shipment: ShipmentEntity;

  @Column({ type: 'uuid' })
  shipmentId: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column({ type: 'uuid' })
  productId: string;
}
