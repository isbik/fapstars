import { User } from '~/entities/user/types';
import apiV1 from '~/shared/api/apiV1';

const buyFullEnergyBoosterApi = async (): Promise<User> => {
  const { data } = await apiV1.post(`boosters/buy_full_energy`);

  return data;
};

export { buyFullEnergyBoosterApi };
