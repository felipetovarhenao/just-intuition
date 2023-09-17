import Fraction from "../types/fractions";
import FractionOp from "./FractionOp";
import randomFraction from "./randomFraction";

export default function getUniqueFractionPair(min: number = 0.125, max: number = 2.9, denom?: number[]): [Fraction, Fraction] {
  const a = randomFraction(min, max, denom);
  let b = { ...a };

  while (FractionOp.equal(a, b)) {
    b = randomFraction(min, max, denom);
  }
  return [a, b];
}
