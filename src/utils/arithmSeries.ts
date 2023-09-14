export default function arithmSeries(start: number = 0, length: number = 10, increment: number = 1) {
  return [...Array(length).keys()].map((_, i) => i * increment + start);
}
