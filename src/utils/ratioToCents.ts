export default function ratioToCents(x: number) {
  return Math.round(1200 * Math.log2(x) * 100) / 100;
}
