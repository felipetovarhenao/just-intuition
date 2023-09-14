import Fraction from "../types/fractions";
import FractionOp from "./FractionOp";
import random from "./random";

export default function randomFraction(min: number = 0, max: number = 1, denom?: number[]): Fraction {
  return FractionOp.decimalToFraction(random(min, max), denom);
}
