const pluckToMap = <T, K extends keyof T>(arr: T[], keyField: K): Map<T[K], T> => {
  const map = new Map<T[K], T>();
  arr.forEach(item => {
    map.set(item[keyField], item);
  });

  return map;
};

export default pluckToMap;
