interface APIPagination {
  total: number;
  page: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  lastPageUrl: string; // "/?page=10",
  firstPageUrl: string; // "/?page=1",
  nextPageUrl: string; // "/?page=6",
  previousPageUrl: string; // "/?page=5"
}

export default APIPagination;
