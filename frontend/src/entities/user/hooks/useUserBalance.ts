import useAuth from '~/app/context/auth/useAuth';
import { getBalanceFromLocalStorage } from '~/entities/mine/utils';

export const useUserBalance = () => {
  const { user } = useAuth();

  const balance = Number(getBalanceFromLocalStorage() ?? user?.balance ?? 0);

  return balance;
};
