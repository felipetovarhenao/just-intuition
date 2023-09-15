import "./App.scss";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { questionActions } from "./redux/questionSlice";
import Question from "./components/Question/Question";
import Button from "./components/Button/Button";

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
    <div className="app">
      <h1 className="app__name">just intuition</h1>
      <h2>web app</h2>
      <div className="app__container">
        {questions.length === 0 ? (
          <Button onClick={() => dispatch(questionActions.generate(10))}>start new quiz</Button>
        ) : (
          <div className="app__container__question-card">
            <div>Progress: {`${Math.round((questionIndex / questions.length) * 100)}%`}</div>
            {<Question key={questionIndex} id={questionIndex} question={questions[questionIndex]} />}
            {questionIndex < questions.length - 1 ? (
              <Button
                className="app__container__question-card__button"
                disabled={questions[questionIndex].response === undefined}
                onClick={nextQuestion}
              >
                next question
              </Button>
            ) : (
              <Button className="app__container__question-card__button" onClick={submitAnswers} disabled={!isComplete}>
                submit
              </Button>
            )}
          </div>
        )}
      </div>
      {evaluation && <div>Your score is {Math.round(evaluation?.score * 100)}%</div>}
      <br />
      <footer className="app__footer">To report a bug, please send me an email</footer>
    </div>
  );
}

export default App;
