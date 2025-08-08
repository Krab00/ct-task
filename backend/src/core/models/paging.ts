export interface PagingOptions {
  page?: number;
  take?: number;
}

export interface PagingResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
