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
