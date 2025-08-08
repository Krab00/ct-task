
export interface ProductBase {
  id?: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  currency: string;
  unitPrice: number;
  imageUrl?: string;
}

export type CreateProductRequest = ProductBase & { image?: File};
export type UpdateProductRequest = ProductBase & { image?: File | string };
