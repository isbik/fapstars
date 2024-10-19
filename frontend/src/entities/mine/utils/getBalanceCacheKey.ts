/**
 * Получает уникальынй ключ кэша для баланса пользователя
 * @param userId - telegram user id
 * @returns cache key
 */
const getBalanceCacheKey = (userId: number | string): string => {
  return `'faspstats:user_${userId}:balance'`;
};

export default getBalanceCacheKey;
