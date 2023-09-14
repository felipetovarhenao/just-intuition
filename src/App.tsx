import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { questionActions } from "./redux/questionSlice";
import Question from "./components/Question";

function App() {
  const { questions, evaluation } = useAppSelector((state) => state.question);
  const dispatch = useAppDispatch();

  const [isComplete, setIsComplete] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);

  function nextQuestion() {
    setQuestionIndex((x) => x + 1);
  }

  function submitAnswers() {
    dispatch(questionActions.evaluate());
    setQuestionIndex(0);
  }

  useEffect(() => {
    if (questions.length === 0) {
      return;
    }
    setIsComplete(questions.every((q) => q.response !== undefined));
  }, [questions]);

  return (
    <div>
      <h1>Just intuition app</h1>
      {questions.length === 0 ? (
        <button onClick={() => dispatch(questionActions.generate(3))}>start new quiz</button>
      ) : (
        <div>
          <div>{`${Math.round((questionIndex / questions.length) * 100)}%`}</div>
          {<Question id={questionIndex} question={questions[questionIndex]} />}
          <div>
            {questionIndex < questions.length - 1 ? (
              <button disabled={questions[questionIndex].response === undefined} onClick={nextQuestion}>
                next question
              </button>
            ) : (
              <button onClick={submitAnswers} disabled={!isComplete}>
                submit
              </button>
            )}
          </div>
        </div>
      )}
      {evaluation && <div>Your score is {Math.round(evaluation?.score * 100)}%</div>}
      <br />
      <footer>To report a bug, please send me an email</footer>
    </div>
  );
}

export default App;
