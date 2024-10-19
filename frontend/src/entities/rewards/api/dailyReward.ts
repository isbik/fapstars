import { User } from '~/entities/user/types';
import apiV1 from '~/shared/api/apiV1';

const dailyRewardApi = async (): Promise<User> => {
  const { data } = await apiV1.post(`rewards/daily`);

  return data;
};

export { dailyRewardApi };
