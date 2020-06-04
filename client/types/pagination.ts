interface Pagination<T> {
  docs: T[];
  totalDocs: number,
  offset: number,
  limit: number,
  totalPages: number,
  page: number,
  pagingCounter: number,
  hasPrevPage: boolean,
  hasNextPage: boolean,
  prevPage: number | null,
  nextPage: number | null
}

export default Pagination;
