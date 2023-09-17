// Define enum for TokenType
export enum TokenType {
  UNKNOWN,
  FRACTION,
  NUMERIC,
  SPECIAL_CHAR,
  ALPHA,
}

// Define Tokenizer type
export type Tokenizer = {
  regex: RegExp;
  type: TokenType;
};

// Define Token type
export type Token = {
  substring: string;
  type: TokenType;
};

const tokenizers: Tokenizer[] = [
  { regex: /\d+\/\d+/, type: TokenType.FRACTION },
  { regex: /-?\d+(\.\d+)?/, type: TokenType.NUMERIC },
  { regex: /[^a-zA-Z0-9\s\(\)\[\\?]]+/, type: TokenType.SPECIAL_CHAR },
  { regex: /[^(\d|\(\))]+/, type: TokenType.ALPHA },
];

// Function to tokenize a string using an array of Tokenizers
export default function tokenizeString(input: string): Token[] {
  const tokens: Token[] = [];
  let remainingString = input;

  while (remainingString.length > 0) {
    let matched = false;

    for (const tokenizer of tokenizers) {
      const match = remainingString.match(tokenizer.regex);

      if (match && match.index === 0) {
        tokens.push({ substring: match[0], type: tokenizer.type });
        remainingString = remainingString.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ substring: remainingString[0], type: TokenType.UNKNOWN });
      remainingString = remainingString.slice(1);
    }
  }

  return tokens;
}
