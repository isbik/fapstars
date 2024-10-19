/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Создает "задержку" для функции, чтобы она вызывалась не чаще одного раза в указанный промежуток времени.
 * @param func Функция, для которой нужно применить debounce.
 * @param delay Время задержки в миллисекундах.
 * @returns Функция с примененным контролем вызова.
 */

const debounce = <F extends (...args: any[]) => void>(func: F, delay: number): ((...args: Parameters<F>) => void) => {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<F>): void {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => func(...args), delay);
  };
};

export default debounce;
