type NearestMatchType<T> = {
  id: number;
  value: T;
  distance: number;
};

export default function findNearest<T>(x: T, arr: T[], func: (a: T, b: T) => number): NearestMatchType<T> {
  const ranking: NearestMatchType<T>[] = [];
  arr.forEach((y, i) =>
    ranking.push({
      id: i,
      value: y,
      distance: func(x, y),
    })
  );
  ranking.sort((a, b) => a.distance - b.distance);
  return ranking[0];
}
