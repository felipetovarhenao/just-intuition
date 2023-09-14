import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import QuestionGen from "../utils/QuestionGen";
import randomChoice from "../utils/randomChoice";
import { BooleanQuestion, FractionalAnswerQuestion, MultipleChoiceQuestion } from "../types/questions";

export type MicSettings = {
  noiseSuppression?: boolean;
};

type InitialState = {
  questions: Array<BooleanQuestion | FractionalAnswerQuestion | MultipleChoiceQuestion>;
  evaluation?: {
    score: number;
  };
};

const initialState: InitialState = {
  questions: [],
};

const question = createSlice({
  name: "question",
  initialState: initialState,
  reducers: {
    generate: (state, action: PayloadAction<number>) => {
      state.questions = [];
      state.evaluation = undefined;
      const q = QuestionGen;
      const callbacks = [q.closestInterval, q.comparison, q.normalForm, q.octaveEquivalence];
      for (let i = 0; i < action.payload; i += 1) {
        const cb = randomChoice(callbacks)!;
        state.questions.push(cb());
      }
    },
    answer: (state, action: PayloadAction<{ id: number; answer: string }>) => {
      state.questions[action.payload.id].response = action.payload.answer;
    },
    evaluate: (state) => {
      let correctCount = 0;
      state.questions.forEach((q) => (correctCount += Number(q.answer === q.response)));
      state.evaluation = {
        score: correctCount / state.questions.length,
      };
      state.questions = [];
    },
  },
});

export default question.reducer;
export const questionActions = question.actions;
