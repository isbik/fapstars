export function formatNumber(number: string | number | bigint = 0): string {
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
