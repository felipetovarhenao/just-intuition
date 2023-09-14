export enum QuestionType {
  FRACTIONAL_ANSWER,
  MULTIPLE_CHOICE,
  BOOLEAN,
}

export type BasicQuestion<T = string> = {
  type: QuestionType;
  prompt: string;
  response?: T;
  answer: T;
};

export type BooleanQuestion = Omit<BasicQuestion<boolean>, "type"> & {
  type: QuestionType.BOOLEAN;
};

export type MultipleChoiceQuestion = Omit<BasicQuestion, "type"> & {
  type: QuestionType.MULTIPLE_CHOICE;
  choices: string[];
};

export type FractionalAnswerQuestion = Omit<BasicQuestion, "type"> & {
  type: QuestionType.FRACTIONAL_ANSWER;
};