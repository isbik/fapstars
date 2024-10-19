import { League } from '../types';

import apiV1 from '~/shared/api/apiV1';

// payload is CreateLeagueRequest interface
const createLeague = async (paylaod: FormData): Promise<League> => {
  const { data } = await apiV1.post(`leagues`, paylaod);

  return data;
};

export default createLeague;
