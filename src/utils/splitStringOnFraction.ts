export default function splitStringOnFraction(input: string): { substring: string; isFraction: boolean }[] {
  const regex = /\d+\/\d+/g;
  const matches = input.match(regex);

  if (!matches) {
    return [{ substring: input, isFraction: false }];
  }

  const result: { substring: string; isFraction: boolean }[] = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    const index = input.indexOf(match);
    if (index > lastIndex) {
      result.push({ substring: input.substring(lastIndex, index), isFraction: false });
    }

    result.push({ substring: match, isFraction: true });
    lastIndex = index + match.length;
  });

  if (lastIndex < input.length) {
    result.push({ substring: input.substring(lastIndex), isFraction: false });
  }

  return result;
}
