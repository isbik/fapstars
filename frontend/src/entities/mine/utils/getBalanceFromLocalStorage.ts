import { BALANCE_CACHE_TTL } from '../config';

import getBalanceCacheKey from './getBalanceCacheKey';
import validateBalance from './validateBalance';

const getBalanceFromLocalStorage = (): string | null => {
  const userTgId = window.Telegram.WebApp.initDataUnsafe.user?.id as number;
  const CACHE_KEY = getBalanceCacheKey(userTgId);
  const balanceFromStorage = localStorage.getItem(CACHE_KEY);

  if (!balanceFromStorage) {
    return null;
  }

  const { balance, cachedAt } = JSON.parse(balanceFromStorage);

  if (new Date().getTime() - cachedAt > BALANCE_CACHE_TTL) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  validateBalance(balance);

  return balance;
};

export default getBalanceFromLocalStorage;
