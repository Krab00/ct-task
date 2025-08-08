import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import {
  ProductBase,
  ProductRoutes,
  PRODUCTS_API_PROVIDER,
} from '@products/models';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { productsTableConfig } from './products-table-config';
import { PagingResponse } from '@core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

interface ProductsListingState {
  loading: boolean;
  dataWithPagination?: PagingResponse<ProductBase>;
}

@Injectable()
export class ProductsStore
  extends ComponentStore<ProductsListingState>
  implements OnStoreInit
{
  private readonly productsApi = inject(PRODUCTS_API_PROVIDER);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  readonly tableConfig = productsTableConfig();
  readonly viewModel$ = this.select((s) => ({
    items: s.dataWithPagination?.data || [],
    pagination: {
      page: s.dataWithPagination?.page,
      pageSize: s.dataWithPagination?.pageSize,
      total: s.dataWithPagination?.total,
    },
    hasItems: !!s.dataWithPagination?.data?.length,
    loading: s.loading,
  }));

  constructor() {
    super({
      loading: true,
      dataWithPagination: {
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
      },
    });
  }

  ngrxOnStoreInit(): void {
    this.fetchPage();
  }

  goToProduct(product: ProductBase) {
    this.router.navigate([product.sku], {
      relativeTo: this.route,
    });
  }

  goToAddProduct() {
    this.router.navigate([ProductRoutes.Create], { relativeTo: this.route });
  }

  pageChange(pageEv: PageEvent) {
    this.patchState({
      dataWithPagination: {
        ...(this.get().dataWithPagination! || {}),
        page: pageEv.pageIndex + 1,
        pageSize: pageEv.pageSize,
      },
    });
    this.fetchPage();
  }

  private fetchPage() {
    const { dataWithPagination } = this.get();
    this.productsApi
      .fetchProducts$({
        page: dataWithPagination?.page || 1,
        pageSize: dataWithPagination?.pageSize || 10,
      })
      .pipe(
        finalize(() => {
          this.patchState({ loading: false });
        }),
        catchError(() => {
          this.snackBar.open('Error while fetching products');
          return EMPTY;
        }),
        tap((response: PagingResponse<ProductBase>) => {
          this.patchState({ dataWithPagination: response });
        })
      )
      .subscribe();
  }
}
