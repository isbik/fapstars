import { APIPagination } from '.';

interface APIPayload<F, S> {
  filter?: F;
  sort?: S;
  include?: string[];
  pagination?: Pick<APIPagination, 'page' | 'perPage'> | null;
  orderBy?: {
    column: string | undefined;
    direction: 'asc' | 'desc' | undefined;
  };
}

export default APIPayload;
