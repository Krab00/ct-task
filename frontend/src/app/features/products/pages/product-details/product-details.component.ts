import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { ProductDetailsStore } from './product-details.cstore';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NumbersOnlyDirective } from '@ui/directives';
import { ImageInputComponent } from '@ui/image-input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NumbersOnlyDirective,
    ImageInputComponent,
    MatSnackBarModule
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [provideComponentStore(ProductDetailsStore)],
  // It's the proper way in current angular(20)
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'wh-page',
  },
})
export class ProductDetailsComponent {
  remove() {
    this.store.remove();
  }
  private readonly store = inject(ProductDetailsStore);
  readonly viewModel$ = this.store.viewModel$;
  readonly form = this.store.form;

  constructor() {}

  save() {
    this.store.save();
  }

  goBack() {
    this.store.goBack();
  }
}
