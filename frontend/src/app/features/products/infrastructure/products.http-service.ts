import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductsApiProvider } from '../models';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Env, Pagination, PagingResponse } from '@core/models';
import {
  CreateProductRequest,
  ProductBase,
  UpdateProductRequest,
} from '@products/models';

export class ProductsHttpService implements ProductsApiProvider {
  protected readonly apiUrl = inject(Env).apiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  createProduct$(create: CreateProductRequest): Observable<ProductBase> {
    const formData = this.createFormData(create);
    return this.http.post<CreateProductRequest>(
      `${this.apiUrl}/products`,
      formData
    );
  }

  updateProduct$(update: UpdateProductRequest): Observable<ProductBase> {
    const formData = this.createFormData(update);
    return this.http.put<UpdateProductRequest>(
      `${this.apiUrl}/products`,
      formData
    );
  }

  fetchProductBySku$(sku: string): Observable<ProductBase> {
    return this.http.get<ProductBase>(`${this.apiUrl}/products/sku/${sku}`);
  }

  removeProduct$(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }

  fetchProducts$(pagination: Pagination): Observable<PagingResponse<ProductBase>> {
    const params = new HttpParams({
      fromObject: {
        page: pagination?.page || 1,
        pageSize: pagination?.pageSize || 10,
      }
    });

    return this.http.get<PagingResponse<ProductBase>>(`${this.apiUrl}/products`, {
      params
    });
  }

  private createFormData(
    dto: CreateProductRequest | UpdateProductRequest
  ): FormData {
    const formData = new FormData();
    formData.append('name', dto.name);
    formData.append('sku', dto.sku);
    formData.append('description', dto.name);
    formData.append('quantity', dto.quantity.toString());
    formData.append('unitPrice', dto.unitPrice.toString());
    if (dto.image && typeof dto.image !== 'string') {
      formData.append('image', dto.image as File, dto.image?.name);
    }
    if (dto.id) {
      formData.append('id', dto.id);
    }
    return formData;
  }
}
