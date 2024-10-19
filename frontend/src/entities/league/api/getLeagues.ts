import { League } from '../types';

import apiV1 from '~/shared/api/apiV1';
import { APIResponse } from '~/shared/types';

const getLeagues = async (page: number = 1, pageSize: number = 5): Promise<APIResponse<League[]>> => {
  const { data } = await apiV1.get(`leagues?page=${page}&pageSize=${pageSize}`);

  return data;
};

export default getLeagues;
