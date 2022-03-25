export function addCommas(value: number): String {
  return value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}
