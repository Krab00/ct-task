import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import {
  ProductRoutes,
  PRODUCTS_API_PROVIDER,
  UpdateProductRequest,
} from '@products/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { CreateProductRequest } from '@products/models';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ProductDetailsState {
  loading: boolean;
  title: string;
  productSku: string | null;
}

@Injectable()
export class ProductDetailsStore
  extends ComponentStore<ProductDetailsState>
  implements OnStoreInit
{
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly snackBar = inject(MatSnackBar);
  private readonly productsApi = inject(PRODUCTS_API_PROVIDER);
  private readonly fb = inject(FormBuilder);

  readonly viewModel$ = this.select((s) => ({
    title: s.title,
    loading: s.loading,
    isExisting: this.isExisting,
  }));

  readonly form: UntypedFormGroup = this.fb.group({
    image: new FormControl(''),
    sku: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    description: new FormControl('', [Validators.maxLength(4000)]),
    quantity: new FormControl(0, [Validators.required]),
    unitPrice: new FormControl(0, [Validators.required]),
  });

  private get productSku(): string | null {
    return this.route.snapshot.paramMap.get('productId');
  }

  private get isExisting(): boolean {
    return !!this.productSku;
  }

  constructor() {
    super({
      title: 'New Product',
      loading: true,
      productSku: null,
    });
  }

  ngrxOnStoreInit() {
    if (!this.isExisting) {
      this.patchState({ loading: false });
      return;
    }
    this.fetchProduct();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    if (this.isExisting) {
      this.update();
      return;
    }

    this.create();
  }

  goBack() {
    this.location.back();
  }

  remove() {
    if (!this.isExisting || !this.form.value.id) {
      return;
    }

    const removalError = () => this.snackBar.open(`Removal of ${this.productSku} went wrong.`);

    this.patchState({ loading: false });
    this.productsApi
      .removeProduct$(this.form.value.id)
      .pipe(
        catchError(() => {
          removalError();
          return EMPTY;
        }),
        tap((result) => {
          if (!result) {
            removalError();
            return;
          }
          this.router.navigate(['../'], { relativeTo: this.route });
        })
      )
      .subscribe();
  }

  private fetchProduct(): void {
    if (!this.productSku) {
      return;
    }
    this.patchState({ loading: true, productSku: this.productSku });
    this.form.addControl('id', this.fb.control({}));
    this.productsApi
      .fetchProductBySku$(this.productSku)
      .pipe(
        finalize(() => this.patchState({ loading: false })),
        catchError(() => {
          this.snackBar.open(`Error fetching product: ${this.productSku}`);
          this.router.navigate(['..', ProductRoutes.Create], {
            relativeTo: this.route,
          });
          return EMPTY;
        }),
        tap((product) => {
          this.form.patchValue({
            image: product.imageUrl || '',
            sku: product.sku,
            name: product.name,
            description: product.description || '',
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            id: product.id,
          });
          this.patchState({ title: `Edit Product - ${product.name}` });
        })
      )
      .subscribe();
  }

  private create(): void {
    this.productsApi
      .createProduct$(this.form.value as CreateProductRequest)
      .pipe(
        finalize(() => this.patchState({ loading: false })),
        catchError(() => {
          this.snackBar.open(`Can't create product`);
          return EMPTY;
        }),
        tap(() => this.goBackToRoot())
      )
      .subscribe();
  }

  private update() {
    this.productsApi
      .updateProduct$(this.form.value as UpdateProductRequest)
      .pipe(
        finalize(() => this.patchState({ loading: false })),
        catchError(() => {
          this.snackBar.open(`Error updating product: ${this.productSku}`);
          return EMPTY;
        }),
        tap(() => this.goBackToRoot())
      )
      .subscribe();
  }

  private goBackToRoot() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
