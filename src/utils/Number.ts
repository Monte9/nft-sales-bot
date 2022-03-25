export function rounded(value: number): number {
  return Math.round(value * 100) / 100 || 0
}
