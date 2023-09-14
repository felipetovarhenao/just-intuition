import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import QuestionGen from "../utils/QuestionGen";
import randomChoice from "../utils/randomChoice";
import { BooleanQuestion, FractionalAnswerQuestion, MultipleChoiceQuestion } from "../types/questions";

export type MicSettings = {
  noiseSuppression?: boolean;
};

type InitialState = {
  questions: Array<BooleanQuestion | FractionalAnswerQuestion | MultipleChoiceQuestion>;
};

const initialState: InitialState = {
  questions: [],
};

const question = createSlice({
  name: "question",
  initialState: initialState,
  reducers: {
    add: (state, action: PayloadAction<any>) => {
      state.questions.push(action.payload);
    },
    clear: (state) => {
      state.questions = [];
    },
    generate: (state, action: PayloadAction<number>) => {
      state.questions = [];
      const q = QuestionGen;
      const callbacks = [q.closestInterval, q.comparison, q.normalForm, q.octaveEquivalence];
      for (let i = 0; i < action.payload; i += 1) {
        const cb = randomChoice(callbacks)!;
        state.questions.push(cb());
      }
    },
  },
});

export default question.reducer;
export const questionActions = question.actions;
