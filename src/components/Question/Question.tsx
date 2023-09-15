import "./Question.scss";
import { GenericQuestion, QuestionType } from "../../types/questions";
import FractionalAnswer from "../FractionalAnswer/FractionalAnswer";
import MultipleChoiceAnswers from "../MultipleChoiceAnswers/MultipleChoiceAnswers";
import Icon from "../Icon/Icon";
import Hr from "../Hr/Hr";

type QuestionProps = {
  id: number;
  question: GenericQuestion;
  readonly?: boolean;
};

const Question = ({ id, question, readonly = false }: QuestionProps) => {
  return (
    <div className="question">
      <h4 className="question__header">question {id + 1}</h4>
      <div className="question__prompt">{question.prompt}</div>
      <br />
      {!readonly ? (
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
      ) : (
        <div className="question__readonly">
          {question.answer !== question.response && (
            <div className="question__readonly__answer --incorrect">
              <Icon icon="icon-park-solid:error" />
              {question.response}
            </div>
          )}
          <div className="question__readonly__answer --correct">
            <Icon icon="mingcute:check-fill" /> {question.answer}
          </div>
          <Hr className="question__readonly__hr" />
        </div>
      )}
    </div>
  );
};

export default Question;
