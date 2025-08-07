export interface ProductBase {
  id?: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

export type ProductCreateDto = ProductBase & {
  image?: Buffer;
};

export type ProductUpdateDto = ProductBase & {
  image?: Buffer;
};
