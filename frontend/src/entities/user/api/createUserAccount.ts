import { CreateUserAccountRequest, User } from '../types';

import apiV1 from '~/shared/api/apiV1';

const createUserAccount = async (payload: CreateUserAccountRequest): Promise<User> => {
  const { data } = await apiV1.post(`users`, payload);

  return data;
};

export default createUserAccount;
