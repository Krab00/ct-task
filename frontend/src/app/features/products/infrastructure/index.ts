import { PRODUCTS_API_PROVIDER } from '@products/models';
import { ProductsHttpService } from './products.http-service';
import { Provider } from '@angular/core';

export const provideProductsApi = (): Provider => ({
  provide: PRODUCTS_API_PROVIDER,
  useClass: ProductsHttpService,
});
