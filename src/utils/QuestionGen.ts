import Fraction from "../types/fractions";
import { BooleanQuestion, FractionalAnswerQuestion, MultipleChoiceQuestion, QuestionType } from "../types/questions";
import FractionOp from "./FractionOp";
import findNearest from "./findNearest";
import generateURNArray from "./generateURNArray";
import getUniqueFractionPair from "./getUniqueFractionPair";
import randomChoice from "./randomChoice";
import randomFraction from "./randomFraction";
import ratioToCents from "./ratioToCents";
import shuffleArray from "./shuffleArray";
import wrapValue from "./wrapValue";

export default class QuestionGen {
  public static normalForm(): FractionalAnswerQuestion {
    const isBelow = Math.random() > 0.5;
    const ratio = randomFraction(...(isBelow ? [0.1, 0.9] : [2.1, 5]));
    const prompt = `Provide a reduced interval ratio that is octave-equivalent to ${FractionOp.toString(
      ratio
    )}, such that it falls in the (1, 2] range — i.e., 1 ≤ ratio < 2`;

    const normRatio = FractionOp.normalize(ratio);
    const answer = FractionOp.toString(normRatio);

    const getProof = (): string => {
      const numOctaves = Math.round(Math.log2(FractionOp.fractionToDecimal(FractionOp.divide(ratio, normRatio))));
      const times = Math.abs(numOctaves);
      const isPlural = times > 1;
      const isPositive = numOctaves > 0;
      const input = FractionOp.toString(ratio);
      const floatAnswer = Math.round(FractionOp.fractionToDecimal(normRatio) * 100) / 100;
      const proof = `${input} is ${times} octave${isPlural ? "s" : ""} ${isPositive ? "above" : "below"} the desired range, which means we must ${
        isPositive ? "divide" : "multiply"
      } ${input} by 2${isPlural ? `, ${times} times (i.e., 2 to the power of ${times}),` : ""} to get ${answer} (${floatAnswer}).`;
      return proof;
    };
    return {
      type: QuestionType.FRACTIONAL_ANSWER,
      prompt,
      answer,
      proof: getProof(),
    };
  }
  public static closestInterval(): MultipleChoiceQuestion {
    const intervalNames = [
      "perfect unison",
      "minor second",
      "major second",
      "minor third",
      "major third",
      "perfect fourth",
      "tritone",
      "perfect fifth",
      "minor sixth",
      "major sixth",
      "minor seventh",
      "major seventh",
      "perfect octave",
    ];

    const intervalRatios = intervalNames.map((_, i) => 2 ** (i / 12));

    const ratio = randomFraction(1, 2);

    const closest = findNearest(FractionOp.fractionToDecimal(ratio), intervalRatios, (a: number, b: number) => Math.abs(Math.log2(a / b)));

    const prompt = `Which of the following equal-tempered intervals better approximates the interval ratio ${FractionOp.toString(ratio)}?`;

    const answer = intervalNames[closest.id];
    const randomIndices = generateURNArray(3, intervalNames.length - 1).map((x) => x + 1);

    const choices = shuffleArray([0, ...randomIndices]).map((x) => intervalNames[wrapValue(closest.id + x, intervalNames.length)]);

    const getProof = () => {
      const aCents = ratioToCents(FractionOp.fractionToDecimal(ratio));
      const bCents = ratioToCents(intervalRatios[closest.id]);
      const closestName = intervalNames[closest.id];
      return `Expressed in cents, a ${closestName} is ${bCents}¢, while the ratio ${FractionOp.toString(
        ratio
      )} is ${aCents}¢. Among the options, the ${closestName} is the best approximation (${
        Math.round(Math.abs(aCents - bCents) * 100) / 100
      }¢ difference).`;
    };

    return {
      type: QuestionType.MULTIPLE_CHOICE,
      prompt,
      answer,
      proof: getProof(),
      choices,
    };
  }

  public static comparison(): BooleanQuestion {
    const [a, b] = getUniqueFractionPair();

    const ops = [
      {
        symbol: ">",
        func: (a: Fraction, b: Fraction) => FractionOp.gt(a, b),
      },
      {
        symbol: "<",
        func: (a: Fraction, b: Fraction) => FractionOp.lt(a, b),
      },
    ];

    const op = randomChoice(ops);

    const answer = String(op!.func(a, b) as boolean);

    const getPrompt = (a: string, b: string, op: string) => {
      const isPitch = Math.random() > 0.5;
      const noun = isPitch ? "pitch" : "interval";
      const comparison = op === ops[0].symbol ? (isPitch ? "higher" : "larger") : isPitch ? "lower" : "smaller";
      return `Is the ${noun} ratio ${a} ${comparison} than ${b}?`;
    };

    const prompt = getPrompt(FractionOp.toString(a), FractionOp.toString(b), op!.symbol);

    const getProof = () => {
      const aString = FractionOp.toString(a);
      const bString = FractionOp.toString(b);
      const aFloat = Math.round(FractionOp.fractionToDecimal(a) * 100) / 100;
      const bFloat = Math.round(FractionOp.fractionToDecimal(b) * 100) / 100;
      return `Expressed as decimals, ${aString} is ${aFloat}, and ${bString} is ${bFloat} which means that the statement ${aString} ${
        op!.symbol
      } ${bString} is ${answer}.`;
    };

    return {
      type: QuestionType.BOOLEAN,
      prompt,
      answer,
      proof: getProof(),
    };
  }
  public static octaveEquivalence(): BooleanQuestion {
    let [a, b] = getUniqueFractionPair();

    // we enforce a true answer 50% of the time, to compensate for the
    // unlikelyhood of sampling an octave-equivalent ratio
    // NOTE: without this mechanism the answer would be true ~25% of the time
    const forceTrue = Math.random() > 0.5;

    // check for equivalence
    let isTrue = FractionOp.testOctaveEquivalence(a, b);

    // if randomly enforced and not true already, we apply octave shift
    if (forceTrue && !isTrue) {
      // set answer to true
      isTrue = true;
      // get shift size and direction
      const shiftSize = Math.round(Math.random()) + 1;
      const shiftSign = Math.round(Math.random()) * 2 - 1;
      const shift = FractionOp.decimalToFraction(2 ** (shiftSize * shiftSign));

      // apply shift
      b = FractionOp.reduce(FractionOp.multiply(a, shift));
    }

    const prompt = `Are the pitch ratios ${FractionOp.toString(a)} and ${FractionOp.toString(b)} octave-equivalent?`;

    const getProof = (): string => {
      const aString = FractionOp.toString(a);
      const bString = FractionOp.toString(b);
      if (isTrue) {
        const octaveShift = Math.log2(FractionOp.fractionToDecimal(FractionOp.divide(a, b)));
        const isAbove = octaveShift > 0;
        const numOctaves = Math.abs(octaveShift);
        const isPlural = numOctaves > 1;
        return `${aString} ${isAbove ? "divided" : "multiplied"} by 2${
          isPlural ? `, ${numOctaves} times (i.e., 2 to the power of ${numOctaves}),` : ""
        } is ${bString}, which means that ${FractionOp.toString(a)} and ${FractionOp.toString(b)} are exactly ${numOctaves} octave${
          isPlural ? "s" : ""
        } apart.`;
      } else {
        return `For two ratios to be octave equivalent we must be able to multiply or divide one of them by 2 one or more times to get the other, which is not possible with ${aString} and ${bString}.`;
      }
    };

    return {
      type: QuestionType.BOOLEAN,
      prompt,
      answer: String(isTrue),
      proof: getProof(),
    };
  }

  // public static intervalDifference(): FractionalAnswerQuestion {
  //   let [a, b] = getUniqueFractionPair(1, 2, arithmSeries(2, 4));
  //   a = FractionOp.normalize(a);
  //   b = FractionOp.normalize(b);

  //   const reverse = FractionOp.gt(a, b);

  //   if (reverse) {
  //     [a, b] = [b, a];
  //   }

  //   const prompt = `What's the interval ratio between pitch ratios ${FractionOp.toString(a)} and ${FractionOp.toString(b)}?`;
  //   const answer = FractionOp.toString(FractionOp.divide(a, b));
  //   return {
  //     type: QuestionType.FRACTIONAL_ANSWER,
  //     prompt,
  //     answer,
  //   };
  // }
}
