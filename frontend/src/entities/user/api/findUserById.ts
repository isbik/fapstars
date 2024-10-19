import { User } from '../types';

import apiV1 from '~/shared/api/apiV1';
import { APIResponse } from '~/shared/types';

const findUserById = async (userId: string): Promise<APIResponse<User>> => {
  const { data } = await apiV1.get(`users?id=${userId}`);

  return data;
};

export default findUserById;
