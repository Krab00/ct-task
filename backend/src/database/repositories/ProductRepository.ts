import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { ProductEntity } from '../entities/product.entity';

export class ProductRepository {
  private repository: Repository<ProductEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductEntity);
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<ProductEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(productData: Partial<ProductEntity>): Promise<ProductEntity> {
    const product = this.repository.create(productData);
    return this.repository.save(product);
  }

  async update(id: number, productData: Partial<ProductEntity>): Promise<ProductEntity | null> {
    await this.repository.update(id, productData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}