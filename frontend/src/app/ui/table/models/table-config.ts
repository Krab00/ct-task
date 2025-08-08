

export type TableColumn<T> = {
  field: keyof T;
  label: string;
  valueFormatter?: (value: T, table: TableColumn<T>) => string;
}
export type TableConfig<T> = {
  clickable?: boolean;
  columns: TableColumn<T>[]
}