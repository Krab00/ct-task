import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'products',
  schema: 'warehouse',
})
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}
