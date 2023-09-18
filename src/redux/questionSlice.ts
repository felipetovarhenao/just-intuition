import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import QuestionGen from "../utils/QuestionGen";
import { BooleanQuestion, FractionalAnswerQuestion, MultipleChoiceQuestion } from "../types/questions";
import generateURNArray from "../utils/generateURNArray";

export type MicSettings = {
  noiseSuppression?: boolean;
};

type QuestionArray = Array<BooleanQuestion | FractionalAnswerQuestion | MultipleChoiceQuestion>;

type InitialState = {
  questions: QuestionArray;
  evaluation?: {
    score: number;
    summary: QuestionArray;
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
      const callbacks = [q.closestInterval, q.comparison, q.normalForm, q.octaveEquivalence, q.centApprox];
      const prompts: string[] = [];
      generateURNArray(action.payload, callbacks.length).map((i) => {
        let q = callbacks[i]();

        // ensure prompts are not repeated
        let count = 0;
        const maxIter = 50;
        while (prompts.includes(q.prompt) && count < maxIter) {
          q = callbacks[i]();
          count++;
        }

        prompts.push(q.prompt);
        state.questions.push(q);
      });
    },
    answer: (state, action: PayloadAction<{ id: number; answer: string | undefined }>) => {
      state.questions[action.payload.id].response = action.payload.answer;
    },
    evaluate: (state) => {
      let correctCount = 0;
      state.questions.forEach((q) => (correctCount += Number(q.answer === q.response)));
      state.evaluation = {
        score: correctCount / state.questions.length,
        summary: [...state.questions],
      };
      state.questions = [];
    },
  },
});

export default question.reducer;
export const questionActions = question.actions;
