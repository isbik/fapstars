import { SearchUsersFilter, SearchUsersSort, User } from '../types';

import apiV1 from '~/shared/api/apiV1';
import { APIPayload, APIResponse } from '~/shared/types';

/**
 * Поиск пользователя
 */
const searchUser = async (payload: APIPayload<SearchUsersFilter, SearchUsersSort>): Promise<APIResponse<User[]>> => {
  const { data } = await apiV1.post(`users/search`, payload);

  return data;
};

export default searchUser;
