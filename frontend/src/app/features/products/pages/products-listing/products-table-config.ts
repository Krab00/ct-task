import { TableConfig } from '@ui/table';
import { ProductBase } from '@products/models';

export const productsTableConfig = (): TableConfig<ProductBase> => {
  return {
    clickable: true,
    columns: [
      {
        label: 'SKU',
        field: 'sku',
      },
      {
        label: 'Name',
        field: 'name',
      },
      {
        label: 'Unit Price',
        field: 'unitPrice',
        valueFormatter: (value) =>
          `${value.unitPrice} ${value.currency}`,
      },
      {
        label: 'Quantity',
        field: 'quantity',
      },
    ],
  };
}