import { User } from '../types';

import apiV1 from '~/shared/api/apiV1';
import { APIResponse } from '~/shared/types';

/**
 * Поиск пользователя по telergram id
 * @deprecated
 */
const findUserByTgId = async (tgId: string): Promise<APIResponse<User>> => {
  const { data } = await apiV1.get(`users?tgId=${tgId}`);

  return data;
};

export default findUserByTgId;
