import "./App.scss";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { questionActions } from "./redux/questionSlice";
import Question from "./components/Question/Question";
import Button from "./components/Button/Button";
import Logo from "./components/Logo/Logo";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import Icon from "./components/Icon/Icon";
import Hr from "./components/Hr/Hr";

const NUM_QUESTIONS = 2;

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
      <div className="app__header">
        <Logo className="app__header__logo" />
        <h1 className="app__header__name">just intuition</h1>
        <h2 className="app__header__subtitle">a simple educational app for tuning theory enthusiasts</h2>
      </div>
      <div className="app__container">
        {questions.length === 0 ? (
          <>
            {evaluation && (
              <div className="app__container__summary">
                <h2 className="app__container__summary__header">quiz summary</h2>
                <div className="app__container__summary__score">Final score: {Math.round(evaluation?.score * 100)}%</div>
                <ProgressBar value={evaluation!.score} />
                <div className="app__container__summary__questions">
                  {evaluation.summary.map((q, i) => (
                    <Question key={q.prompt} id={i} question={q} readonly />
                  ))}
                </div>
                <br />
              </div>
            )}
            <Button onClick={() => dispatch(questionActions.generate(NUM_QUESTIONS))}>take new quiz</Button>
            {questions.length === 0 && !evaluation && (
              <>
                <br />
                <Hr />
                <div className="app__container__description">
                  <i>just intuition</i> is a simple educational web app that helps you <b>test</b>, <b>assess</b>, and <b>improve</b> your intuition
                  on rational representations of pitches and intervals in the context of just intonation and tuning theory more broadly.
                </div>
                <Hr />
              </>
            )}
          </>
        ) : (
          <div className="app__container__question-card">
            <ProgressBar value={questionIndex / questions.length} />
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
                see results
              </Button>
            )}
          </div>
        )}
      </div>
      <footer className="app__footer">
        <span className="app__footer__text">
          To report a bug, please send me an&nbsp;<a href="emailto:felipe.tovar.henao@gmail.com">email</a>&nbsp;or create an&nbsp;
          <a href="https://github.com/felipetovarhenao/just-intuition/issues">issue</a>&nbsp;on github.
        </span>
        <span className="app__footer__text">
          <a target="_blank" rel="noreferrer" href="https://felipe-tovar-henao.com/">
            https://felipe-tovar-henao.com/
          </a>
          &nbsp;|&nbsp;
          <a target="_blank" rel="noreferrer" href="https://github.com/felipetovarhenao/just-intonation">
            <Icon className="gh-icon" icon="mdi:github" /> view on github
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
