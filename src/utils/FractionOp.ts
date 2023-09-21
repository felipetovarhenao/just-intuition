import Fraction from "../types/fractions";
import arithmSeries from "./arithmSeries";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default class FractionOp {
  public static min(a: Fraction, b: Fraction): Fraction {
    return this.lt(a, b) ? a : b;
  }

  public static max(a: Fraction, b: Fraction): Fraction {
    return this.gt(a, b) ? a : b;
  }

  public static equal(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) === this.fractionToDecimal(b);
  }

  public static mod(a: Fraction, b: Fraction, acceptableDenominators: number[] = [1000]): Fraction {
    return this.decimalToFraction(this.fractionToDecimal(a) % this.fractionToDecimal(b), acceptableDenominators);
  }

  public static gt(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) > this.fractionToDecimal(b);
  }

  public static lt(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) < this.fractionToDecimal(b);
  }

  public static gte(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) >= this.fractionToDecimal(b);
  }

  public static lte(a: Fraction, b: Fraction): boolean {
    return this.fractionToDecimal(a) < this.fractionToDecimal(b);
  }

  public static reduce(fraction: Fraction): Fraction {
    const gcdValue = gcd(fraction.n, fraction.d);
    return { n: fraction.n / gcdValue, d: fraction.d / gcdValue };
  }

  public static add(a: Fraction, b: Fraction): Fraction {
    return { n: a.n * b.d + b.n * a.d, d: a.d * b.d };
  }

  public static subtract(a: Fraction, b: Fraction) {
    return { n: a.n * b.d - b.n * a.d, d: a.d * b.d };
  }

  public static multiply(a: Fraction, b: Fraction): Fraction {
    return { n: a.n * b.n, d: a.d * b.d };
  }

  public static divide(a: Fraction, b: Fraction): Fraction {
    return this.reduce({ n: a.n * b.d, d: a.d * b.n });
  }

  public static fractionToDecimal(fraction: Fraction): number {
    return fraction.n / fraction.d;
  }

  public static toString(fraction: Fraction): string {
    return `${fraction.n}/${fraction.d}`;
  }

  public static testOctaveEquivalence(a: Fraction, b: Fraction) {
    const ratio = this.fractionToDecimal(this.divide(a, b));
    const numOctaves = Math.log2(ratio);
    return Math.abs(numOctaves - Math.round(numOctaves)) < 1e-5;
  }

  public static normalize(x: Fraction) {
    let i = 0;
    const maxIter = 50;
    let y = { ...x };
    const isAbove = (f: Fraction) => this.gte(f, { n: 2, d: 1 });
    const isBelow = (f: Fraction) => this.lt(f, { n: 1, d: 1 });
    while ((isAbove(y) || isBelow(y)) && i < maxIter) {
      y = this.multiply(y, isAbove(y) ? { n: 1, d: 2 } : { n: 2, d: 1 });
      i += 1;
    }
    return this.reduce(y);
  }

  public static decimalToFraction(decimal: number, acceptableDenominators: number[] = arithmSeries(1, 11)): Fraction {
    let bestNumerator = 0;
    let bestDenominator = 1;
    let bestError = Math.abs(decimal);

    for (let i = 0; i < acceptableDenominators.length; i++) {
      const denominator = acceptableDenominators[i];
      const numerator = Math.round(decimal * denominator);
      const error = Math.abs(decimal - numerator / denominator);

      if (error < bestError) {
        bestNumerator = numerator;
        bestDenominator = denominator;
        bestError = error;
      }
    }

    // reduce before returning
    return this.reduce({ n: bestNumerator, d: bestDenominator });
  }
}
