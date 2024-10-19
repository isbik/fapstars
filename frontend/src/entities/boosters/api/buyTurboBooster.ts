import { User } from '~/entities/user/types';
import apiV1 from '~/shared/api/apiV1';

const buyTurboBoosterApi = async (): Promise<User> => {
  const { data } = await apiV1.post(`boosters/buy_turbo`);

  return data;
};

export { buyTurboBoosterApi };
