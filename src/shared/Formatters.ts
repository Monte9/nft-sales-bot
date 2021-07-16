export function addCommas(value: number): String {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
