import { League } from '../types';

import apiV1 from '~/shared/api/apiV1';

const getLeagueById = async (id: string): Promise<League> => {
  const { data } = await apiV1.get(`leagues/${id}`);

  return data;
};

export default getLeagueById;
