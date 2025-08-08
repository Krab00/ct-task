export interface PagingResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}


export interface Pagination {
  page: number;
  pageSize: number;
}