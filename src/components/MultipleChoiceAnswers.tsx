import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { questionActions } from "../redux/questionSlice";

type MultipleChoiceAnswersProps = {
  id: number;
  choices: string[];
};

const MultipleChoiceAnswers = ({ id, choices }: MultipleChoiceAnswersProps) => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.questions);

  return (
    <div>
      {choices.map((option) => (
        <div
          className={questions[id].response === option ? "--selected" : ""}
          key={option}
          onClick={() => dispatch(questionActions.answer({ id, answer: option }))}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default MultipleChoiceAnswers;
