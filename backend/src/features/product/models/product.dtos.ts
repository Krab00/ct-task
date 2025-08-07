export interface ProductBase {
  id?: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface ProductCreateDto extends ProductBase {
  image?: Buffer;
  imageUrl?: string;
}
