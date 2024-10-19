import { AxiosRequestConfig } from 'axios';

import { League, SearchLeaguesFilter, SearchLeaguesSort } from '../types';

import apiV1 from '~/shared/api/apiV1';
import { APIPayload, APIResponse } from '~/shared/types';

export type SearchLeaguesRequest = APIPayload<SearchLeaguesFilter, SearchLeaguesSort>;

const searchLeagues = async (
  payload: SearchLeaguesRequest,
  config?: AxiosRequestConfig,
): Promise<APIResponse<League[]>> => {
  const { data } = await apiV1.post(`leagues/search`, payload, config);

  return data;
};

export default searchLeagues;
