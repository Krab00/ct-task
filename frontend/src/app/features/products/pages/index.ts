import { Routes } from '@angular/router';
import { ProductRoutes } from '@products/models';
import { provideProductsApi } from '@products/infrastructure';

export const productsRoutes: Routes = [
  {
    path: '',
    providers: [provideProductsApi()],
    children: [
      {
        path: ProductRoutes.List,
        loadComponent: () =>
          import('./products-listing/products-listing.component').then(
            (p) => p.ProductsListingComponent
          ),
      },
      {
        path: ProductRoutes.Create,
        pathMatch: 'full',
        loadComponent: () =>
          import('./product-details/product-details.component').then(
            (p) => p.ProductDetailsComponent
          ),
      },
      {
        path: ProductRoutes.View,
        loadComponent: () =>
          import('./product-details/product-details.component').then(
            (p) => p.ProductDetailsComponent
          ),
      },
      {
        path: '**',
        redirectTo: ProductRoutes.List,
      },
    ]
  },
];
