import { User } from '~/entities/user/types';
import apiV1 from '~/shared/api/apiV1';

const updateMultitapBoosterApi = async (): Promise<User> => {
  const { data } = await apiV1.post(`boosters/upgrade_multitap_level`);

  return data;
};

export { updateMultitapBoosterApi };
