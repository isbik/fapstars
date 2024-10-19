import { User } from '~/entities/user/types';
import apiV1 from '~/shared/api/apiV1';

const updateEnergyLimitLevelApi = async (): Promise<User> => {
  const { data } = await apiV1.post(`boosters/upgrade_energy_limit_level`);

  return data;
};

export { updateEnergyLimitLevelApi };
