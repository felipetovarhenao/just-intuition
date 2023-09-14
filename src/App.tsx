import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { questionActions } from "./redux/questionSlice";
import splitStringOnFraction from "./utils/splitStringOnFraction";

function App() {
  const questions = useAppSelector((state) => state.question.questions);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (questions.length === 0) {
      return;
    }
    const result = splitStringOnFraction(questions[0].prompt);
    console.log(result);
  }, [questions]);

  return (
    <div>
      <h1>Just intuition app</h1>
      <button onClick={() => dispatch(questionActions.generate(10))}>generate new quiz</button>
      <div>
        {questions?.map((q, i) => (
          <div key={`${i}-${q.prompt}`}>
            <h2>{`${i + 1}) ${q.prompt}`}</h2>
            <h3>{`${q.answer}`}</h3>
            <br />
          </div>
        ))}
      </div>
      <br />
      <footer>To report a bug, please send me an email</footer>
    </div>
  );
}

export default App;
