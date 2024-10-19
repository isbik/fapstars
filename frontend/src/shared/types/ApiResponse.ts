import APIPagination from './ApiPagination';
import ValidationError from './ValidationError';

interface APIResponse<T> {
  data: T | null;
  errors?: unknown | null | ValidationError[]; // TODO: Описать интерфейс ошибки
  meta?: APIPagination | null;
}

export default APIResponse;
