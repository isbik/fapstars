import { League } from '../types';

import apiV1 from '~/shared/api/apiV1';

// payload is CreateLeagueRequest interface
const updateLeague = async (id: string, paylaod: FormData): Promise<League> => {
  const { data } = await apiV1.patch(`leagues/${id}`, paylaod);

  return data;
};

export default updateLeague;
