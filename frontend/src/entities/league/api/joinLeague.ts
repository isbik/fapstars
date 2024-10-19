import { User } from '~/entities/user/types';
import apiV1 from '~/shared/api/apiV1';

const joinLeague = async (id: string): Promise<User> => {
  const { data } = await apiV1.get(`leagues/enter/${id}`);

  return data;
};

export default joinLeague;
