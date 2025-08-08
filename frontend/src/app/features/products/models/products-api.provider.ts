import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductRequest, ProductBase, UpdateProductRequest } from './products';
import { Pagination, PagingResponse } from '@core/models';

export const PRODUCTS_API_PROVIDER: InjectionToken<ProductsApiProvider> = new InjectionToken<unknown>('PRODUCTS_API_PROVIDERS');

export interface ProductsApiProvider {
  createProduct$(create: CreateProductRequest): Observable<ProductBase>;
  fetchProductBySku$(sku: string): Observable<ProductBase>;
  fetchProducts$(pagination: Pagination): Observable<PagingResponse<ProductBase>>;
  updateProduct$(update: UpdateProductRequest): Observable<ProductBase>;
  removeProduct$(id: string): Observable<boolean>;
}