export function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
export function randomInt(min: number, max: number) {
  return Math.floor(randomFloat(min, max));
}
export function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length)]!;
}
