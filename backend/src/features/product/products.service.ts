import { AppDataSource } from '@database/data-source';
import { ProductEntity } from '@database/entities';
import { Repository } from 'typeorm';
import {
  ProductCreateDto,
  ProductUpdateDto,
  ProductCreateValidation,
  ProductUpdateValidation,
  ProductBase,
} from './models';
import {
  ValidationException,
  ConflictException,
  NotFoundException,
} from '@core/exceptions';
import { PagingOptions, PagingResult } from '@core/models';
import { calculatePaging, createPagingResult } from '@core/helpers';
import { FileStorageService } from '@features/storage/application';

export class ProductsService {
  protected readonly repository: Repository<ProductEntity> =
    AppDataSource.getRepository(ProductEntity);
  protected readonly fileStorageService = new FileStorageService();

  async create(
    productData: ProductCreateDto,
    fileName: string
  ): Promise<ProductEntity> {
    const { error, value } = ProductCreateValidation.validate(productData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ValidationException('Validation failed', error);
    }

    const existingProduct = await this.repository.findOne({
      where: { sku: value.sku },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with SKU '${value.sku}' already exists`
      );
    }
    let imageUrl: string | null = null;
    if (value.image && fileName) {
      const saveFilename = await this.fileStorageService.saveImage(
        value.image,
        fileName
      );
      imageUrl = this.fileStorageService.generatePublicUrl(saveFilename);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image, ...productWithoutImage } = value;
    const saveData = {
      ...productWithoutImage,
    };

    if (imageUrl) {
      saveData.imageUrl = imageUrl;
    }

    const product = this.repository.create(saveData);
    return await this.repository.save(product);
  }

  async fetchProducts(
    options?: PagingOptions
  ): Promise<PagingResult<ProductEntity>> {
    const { skip, take, page } = calculatePaging(options);

    const [data, total] = await this.repository.findAndCount({
      skip,
      take,
    });

    return createPagingResult(data, total, page, take);
  }

  async update(
    productData: ProductUpdateDto,
    fileName?: string
  ): Promise<ProductEntity> {
    const { error, value } = ProductUpdateValidation.validate(productData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ValidationException('Validation failed', error);
    }

    const existingProduct = await this.repository.findOne({
      where: { id: value.id },
    });

    if (!existingProduct) {
      throw new ConflictException(`Product with ID '${value.id}' not found`);
    }

    if (value.sku && value.sku !== existingProduct.sku) {
      const duplicateSku = await this.repository.findOne({
        where: { sku: value.sku },
      });

      if (duplicateSku) {
        throw new ConflictException(
          `Product with SKU '${value.sku}' already exists`
        );
      }
    }

    let imageUrl: string | undefined = undefined;
    if (value.image && fileName) {
      const saveFilename = await this.fileStorageService.saveImage(
        value.image,
        fileName
      );
      imageUrl = this.fileStorageService.generatePublicUrl(saveFilename);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, image, ...updateData } = value;
    const updateFields = { ...updateData };

    if (imageUrl) {
      updateFields.imageUrl = imageUrl;
    }

    await this.repository.update(id!, updateFields);

    const updatedProduct = await this.repository.findOne({
      where: { id },
    });

    return updatedProduct!;
  }

  async delete(id: string): Promise<boolean> {
    if (!id) {
      throw new ValidationException('Missing id');
    }

    const result = await this.repository.softDelete({ id });
    if (!result?.affected) {
      throw new NotFoundException('No matching item');
    }

    return true;
  }

  async findBySku(sku: string): Promise<ProductBase> {
    const result = await this.repository.findOne({
      where: { sku },
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
