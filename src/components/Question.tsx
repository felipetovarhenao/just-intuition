import { GenericQuestion, QuestionType } from "../types/questions";
import FractionalAnswer from "./FractionalAnswer";
import MultipleChoiceAnswers from "./MultipleChoiceAnswers";

type QuestionProps = {
  id: number;
  question: GenericQuestion;
};
const Question = ({ id, question }: QuestionProps) => {
  return (
    <div>
      <h2>{`${id + 1}) ${question.prompt}`}</h2>
      <br />
      <div>
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
