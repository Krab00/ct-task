import { AppDataSource } from '@database/data-source';
import { ProductEntity } from '@database/entities';
import { Repository } from 'typeorm';
import { ProductCreateDto, ProductCreateValidation } from './models';
import { ValidationException, ConflictException } from '@core/exceptions';
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

    const { ...productWithoutImage } = value;
    const saveData: ProductCreateDto = {
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
}
