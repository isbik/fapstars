import { AxiosRequestConfig } from 'axios';

import { IThread, SearchThreadFilter, SearchThreadSort } from '../types';

import apiV1 from '~/shared/api/apiV1';
import { APIPayload, APIResponse } from '~/shared/types';

export type SearchTreadsRequest = APIPayload<SearchThreadFilter, SearchThreadSort>;

const searchThreads = async (
  payload: SearchTreadsRequest,
  config?: AxiosRequestConfig,
): Promise<APIResponse<IThread[]>> => {
  const { data } = await apiV1.post<APIResponse<IThread[]>>(`treads/search`, payload, config);

  return data;
};

export default searchThreads;
