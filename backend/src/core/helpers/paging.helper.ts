import { PagingOptions, PagingResult } from '@core/models';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@constants';

export const calculatePaging = (
  options: PagingOptions = {}
): {
  skip: number;
  take: number;
  page: number;
} => {
  const page = Math.max(1, options.page || 1);
  const take = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, options.take || DEFAULT_PAGE_SIZE)
  );
  const skip = options.skip !== undefined ? options.skip : (page - 1) * take;

  return { skip, take, page };
};

export const createPagingResult = <T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PagingResult<T> => {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
