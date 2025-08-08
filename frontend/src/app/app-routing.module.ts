import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from '@core/models';

const routes: Routes = [
  {
    path: AppRoutes.Products,
    loadChildren: () => import('@products/pages').then(m => m.productsRoutes),
  },
  {
    path: '**',
    redirectTo: AppRoutes.Products,
  },
];
export const appRouting = RouterModule.forRoot(routes);