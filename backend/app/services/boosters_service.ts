import { DateTime } from 'luxon';

import User from '#models/user';

export const buyEverydayBooster = async (userId: string, field: 'fullEnergyBoosterAt' | 'fullTurboBoosterAt') => {
  const user = await User.query().where({ id: userId }).select([field, 'energyLimitLevel']).firstOrFail();

  if (user[field].diff(DateTime.now(), 'hours').as('hours') >= 8) {
    throw new Error('There is limit for this booster');
  }

  const isPast = DateTime.now().diff(user[field], 'hours').as('hours') > 0;
  const value = isPast ? DateTime.now().plus({ hours: 4 }) : user[field].plus({ hours: 4 });

  const params: Partial<User> = {
    [field]: value,
  };

  if (field === 'fullEnergyBoosterAt') {
    params.staminaSpendAt = DateTime.now().minus({
      seconds: user.energyLimitLevel * 500 + 1000,
    });
  }

  await User.query().where({ id: userId }).update(params);

  return params;
};

export const getBoosterPriceByLevel = (level: number) => {
  // Базовое значение (начинаем с 1000)
  const baseValue = 1000;

  // Пропорциональный коэффициент увеличения
  const growthFactor = 1.7; // Можете настроить для достижения нужного результата

  // Рассчитываем значение на текущем шаге
  const result = baseValue * Math.pow(growthFactor, level - 1);

  // Округляем до ближайших 1000
  return Math.round(result / 1000) * 1000;
};

export const upgradeBoosterLevel = async (userId: string, field: 'multitapLevel' | 'energyLimitLevel') => {
  const user = await User.query().where({ id: userId }).select(['balance', field]).firstOrFail();

  const newLevel = user[field] + 1;

  // get booster price
  const needMoney = getBoosterPriceByLevel(user[field]);

  const newBalance = Number(user.balance) - needMoney;

  if (newBalance < 0) {
    throw new Error('Not enough money');
  }

  await User.query()
    .where({ id: userId })
    .update({
      balance: newBalance,
      [field]: newLevel,
    });

  return { balance: newBalance, [field]: newLevel };
};
