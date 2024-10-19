import { User } from '../types';
import { SyncUserRequest } from '../types/SyncUserRequest';

import apiV1 from '~/shared/api/apiV1';

/**
 * Поиск пользователя
 */
const syncUser = async (payload: SyncUserRequest): Promise<Partial<User>> => {
  const { data } = await apiV1.post(`users/sync`, payload);

  return data;
};

export { syncUser };
