import { User } from '~/entities/user/types';
import apiV1 from '~/shared/api/apiV1';

const leaveLeague = async (): Promise<User> => {
  const { data } = await apiV1.get(`leagues/exit`);

  return data;
};

export default leaveLeague;
