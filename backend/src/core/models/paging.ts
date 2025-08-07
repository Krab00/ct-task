export interface PagingOptions {
  page?: number;
  take?: number;
  skip?: number;
}

export interface PagingResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}