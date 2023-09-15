import "./MultipleChoiceAnswers.scss";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { questionActions } from "../../redux/questionSlice";

type MultipleChoiceAnswersProps = {
  id: number;
  choices: string[];
};

const MultipleChoiceAnswers = ({ id, choices }: MultipleChoiceAnswersProps) => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.questions);

  return (
    <div className="multiple-choice-answer">
      {choices.map((option) => (
        <div
          className={classNames("multiple-choice-answer__option", { "--selected": questions[id].response === option })}
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
