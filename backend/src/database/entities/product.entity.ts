import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CurrencyCode } from '@database/entities/enums/currency-code';

@Entity({
  name: 'products',
  schema: 'warehouse',
})
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 4000, nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({
    type: 'enum',
    enum: CurrencyCode,
    default: CurrencyCode.Eur,
  })
  currency: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;
}
