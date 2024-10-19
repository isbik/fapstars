/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Создает функцию, которая вызывается не чаще одного раза в указанный интервал времени.
 * @param func Функция, для которой нужно применить throttle.
 * @param limit Интервал времени в миллисекундах, в течение которого функция может быть вызвана не более одного раза.
 * @returns Функция с ограничением вызова.
 */
const throttle = <F extends (...args: any[]) => void>(func: F, limit: number): ((...args: Parameters<F>) => void) => {
  let lastRan = 0;
  let lastFunc: number | undefined;

  return (...args: Parameters<F>): void => {
    const now = Date.now();
    if (!lastRan || now - lastRan >= limit) {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      lastRan = now;
      func(...args);
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(
        () => {
          lastRan = Date.now();
          func(...args);
        },
        limit - (now - lastRan),
      );
    }
  };
};

export default throttle;
