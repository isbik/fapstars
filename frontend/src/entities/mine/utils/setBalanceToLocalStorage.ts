import getBalanceCacheKey from './getBalanceCacheKey';
import validateBalance from './validateBalance';

const setBalanceToLocalStorage = (balance: string): void => {
  validateBalance(balance);
  const userTgId = window.Telegram.WebApp.initDataUnsafe.user?.id as number;
  const CACHE_KEY = getBalanceCacheKey(userTgId);

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      balance,
      cachedAt: new Date().getTime(),
    }),
  );
};

export default setBalanceToLocalStorage;
