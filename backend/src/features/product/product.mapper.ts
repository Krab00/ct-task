import { ProductCreateDto, ProductUpdateDto } from './models/product.dtos';

export const mapRequestToProductDto = (
  body: ProductCreateDto | ProductUpdateDto,
  file?: { buffer: Buffer }
): ProductCreateDto | ProductUpdateDto => {
  return {
    ...body,
    quantity: body.quantity ? parseInt(body.quantity.toString(), 10) : 0,
    unitPrice: body.unitPrice ? parseFloat(body.unitPrice.toString()) : 0,
    image: file ? file.buffer : undefined,
  };
};
