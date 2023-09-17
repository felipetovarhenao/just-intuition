import Fraction from "../types/fractions";
import { BooleanQuestion, FractionalAnswerQuestion, MultipleChoiceQuestion, QuestionType } from "../types/questions";
import FractionOp from "./FractionOp";
import findNearest from "./findNearest";
import generateURNArray from "./generateURNArray";
import getUniqueFractionPair from "./getUniqueFractionPair";
import randomChoice from "./randomChoice";
import randomFraction from "./randomFraction";
import shuffleArray from "./shuffleArray";
import wrapValue from "./wrapValue";

export default class QuestionGen {
  public static normalForm(): FractionalAnswerQuestion {
    const isBelow = Math.random() > 0.5;
    const ratio = randomFraction(...(isBelow ? [0.1, 0.9] : [2.1, 5]));
    const prompt = `Provide a reduced interval ratio that is octave-equivalent to ${FractionOp.toString(
      ratio
    )}, such that it falls in the (1, 2] range — i.e., 1 ≤ ratio < 2`;
    const answer = FractionOp.toString(FractionOp.normalize(ratio));
    return {
      type: QuestionType.FRACTIONAL_ANSWER,
      prompt,
      answer,
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

    return {
      type: QuestionType.MULTIPLE_CHOICE,
      prompt,
      answer,
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

    return {
      type: QuestionType.BOOLEAN,
      prompt,
      answer,
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

    return {
      type: QuestionType.BOOLEAN,
      prompt,
      answer: String(isTrue),
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
