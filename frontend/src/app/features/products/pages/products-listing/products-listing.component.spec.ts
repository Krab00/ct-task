import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsListingComponent } from './products-listing.component';
import { ProductsStore } from './products-listing.cstore';
import { of } from 'rxjs';
import { TableConfig } from '@ui/table';

describe('ProductsListingComponent', () => {
  const mockItems = [
    { id: '1', sku: 'SKU001' },
    { id: '2', sku: 'SKU002' },
  ];

  const given = (
    data?: Partial<{ vm: unknown; tableConfig: TableConfig<unknown> }>
  ) => {
    TestBed.overrideProvider(ProductsStore, {
      useValue: {
        viewModel$: of(data?.vm || {}),
        tableConfig: data?.tableConfig || {},
        goToAddProduct: jest.fn(),
        goToProduct: jest.fn(),
        pageChange: jest.fn(),
      },
    });

    TestBed.configureTestingModule({
      imports: [ProductsListingComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductsListingComponent);
    fixture.detectChanges();
    return {
      fixture,
      debug: fixture.debugElement,
      component: fixture.componentInstance,
    };
  };

  it('should render loader when loading', () => {
    const { debug } = given({
      vm: {
        loading: true,
        hasItems: false,
        items: [],
        pagination: { total: 0 },
      },
    });

    const spinnerContainer = debug.query(By.css('.spinner-container'));
    expect(spinnerContainer).toBeTruthy();
  });

  it('should render page with items', () => {
    const { debug } = given({
      vm: {
        loading: false,
        hasItems: true,
        items: mockItems,
        pagination: { total: 2, page: 1, pageSize: 10 },
      },
    });

    const table = debug.query(By.css('app-table'));
    const paginator = debug.query(By.css('mat-paginator'));

    expect(table).toBeTruthy();
    expect(paginator).toBeTruthy();
  });

  it('should show message when no results', () => {
    const { debug } = given({
      vm: {
        loading: false,
        hasItems: false,
        items: [],
        pagination: { total: 0 },
      },
    });

    const noResultsMessage = debug.query(By.css('h1'));
    expect(noResultsMessage).toBeTruthy();
    expect(noResultsMessage.nativeElement.textContent.trim()).toBe(
      'No products found'
    );
  });

  it('should proxy add click', () => {
    const { component } = given({
      vm: {
        loading: false,
        hasItems: false,
        items: [],
        pagination: { total: 0 },
      },
    });

    const store = TestBed.inject(ProductsStore);
    component.addProduct();

    expect(store.goToAddProduct).toHaveBeenCalled();
  });

  it('should proxy page change', () => {
    const { component } = given({
      vm: {
        loading: false,
        hasItems: true,
        items: [],
        pagination: { total: 100 },
      },
    });

    const store = TestBed.inject(ProductsStore);
    const pageEvent = { pageIndex: 1, pageSize: 20, length: 100 };
    component.changePaging(pageEvent);

    expect(store.pageChange).toHaveBeenCalledWith(pageEvent);
  });

  it('should proxy row click', () => {
    const { component } = given({
      vm: {
        loading: false,
        hasItems: true,
        items: [],
        pagination: { total: 100 },
      },
    });

    const store = TestBed.inject(ProductsStore);
    const mockProduct = {
      id: mockItems[0].id,
      sku: mockItems[0].sku,
    }
    component.goToProduct(mockProduct as never);

    expect(store.goToProduct).toHaveBeenCalledWith(mockProduct);
  });
});
