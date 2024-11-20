export type PaginationDto<T> = {
  data: T[];
  count: number;
  page: number;
  limit: number;
};