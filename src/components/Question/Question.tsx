import "./Question.scss";
import { GenericQuestion, QuestionType } from "../../types/questions";
import FractionalAnswer from "../FractionalAnswer/FractionalAnswer";
import MultipleChoiceAnswers from "../MultipleChoiceAnswers/MultipleChoiceAnswers";

type QuestionProps = {
  id: number;
  question: GenericQuestion;
};

const Question = ({ id, question }: QuestionProps) => {
  return (
    <div className="question">
      <h4 className="question__header">question {id + 1}</h4>
      <div className="question__prompt">{question.prompt}</div>
      <br />
      <div className="question__user-input">
        {(() => {
          switch (question.type) {
            case QuestionType.BOOLEAN:
              return <MultipleChoiceAnswers id={id} choices={["true", "false"]} />;
            case QuestionType.MULTIPLE_CHOICE:
              return <MultipleChoiceAnswers id={id} choices={question.choices} />;
            case QuestionType.FRACTIONAL_ANSWER:
              return <FractionalAnswer id={id} />;
            default:
              return <></>;
          }
        })()}
      </div>
    </div>
  );
};

export default Question;
