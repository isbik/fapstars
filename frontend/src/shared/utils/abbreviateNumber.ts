export function abbreviateNumber(x: string | number | bigint = 0, decimalPlaces: number = 2) {
  if (!x) return 0;

  const value = Number(x);

  if (isNaN(value) || value < 1e3) return value;
  const units = ['K', 'M', 'B', 'T'];
  const divisor = [1e3, 1e6, 1e9, 1e12].find(d => value < d * 1e3) ?? 1e12;
  const num = (value / divisor).toFixed(decimalPlaces);
  return parseFloat(num).toString() + units[[1e3, 1e6, 1e9, 1e12].indexOf(divisor)];
}
