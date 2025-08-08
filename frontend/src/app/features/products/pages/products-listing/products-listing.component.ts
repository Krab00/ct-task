import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { ProductsStore } from './products-listing.cstore';
import { TableComponent } from '@ui/table';
import { ProductBase } from '@products/models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products-listing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TableComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
  templateUrl: './products-listing.component.html',
  styleUrls: ['./products-listing.component.scss'],
  providers: [provideComponentStore(ProductsStore)],
  // It's the proper way in current angular(20)
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'wh-page',
  },
})
export class ProductsListingComponent {
  private readonly store = inject(ProductsStore);
  readonly tableConfig = this.store.tableConfig;
  readonly viewModel$ = this.store.viewModel$;

  addProduct() {
    this.store.goToAddProduct();
  }

  goToProduct(product: ProductBase) {
    this.store.goToProduct(product);
  }

  changePaging(pageEv: PageEvent) {
    this.store.pageChange(pageEv);

  }
}
