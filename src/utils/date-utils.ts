export function toISODate(input: Date) {
  return input.toISOString().split('T')[0];
}
