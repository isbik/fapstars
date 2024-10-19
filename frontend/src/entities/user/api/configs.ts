import { Configs } from '../types/Configs';

import apiV1 from '~/shared/api/apiV1';

const getConfigsApi = async (): Promise<Configs> => {
  const { data } = await apiV1.get('/configs');

  return data;
};

export { getConfigsApi };
