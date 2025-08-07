import { Repository } from 'typeorm';
import { ProductEntity } from '@database/entities';
import { AppDataSource } from '@database/data-source';

export class ProductRepository {
  private repository: Repository<ProductEntity> =
    AppDataSource.getRepository(ProductEntity);

  // async findAll(): Promise<ProductEntity[]> {
  //   return this.repository.find();
  // }
  //
  // async findById(id: number): Promise<ProductEntity | null> {
  //   return this.repository.findOne({ where: { id } });
  // }

  async create(productData: Partial<ProductEntity>): Promise<ProductEntity> {
    const product = this.repository.create(productData);
    return await this.repository.save(product);
  }

  // async update(id: number, productData: Partial<ProductEntity>): Promise<ProductEntity | null> {
  //   await this.repository.update(id, productData);
  //   return this.findById(id);
  // }

  // async delete(id: number): Promise<boolean> {
  //   const result = await this.repository.delete(id);
  //   return result.affected > 0;
  // }
}
