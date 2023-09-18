import "./Question.scss";
import { GenericQuestion, QuestionType } from "../../types/questions";
import FractionalAnswer from "../FractionalAnswer/FractionalAnswer";
import MultipleChoiceAnswers from "../MultipleChoiceAnswers/MultipleChoiceAnswers";
import Icon from "../Icon/Icon";
import Hr from "../Hr/Hr";
import classNames from "classnames";
import tokenizeString, { TokenType } from "../../utils/tokenizeString";
import HelpBox from "../HelpBox/HelpBox";

type QuestionProps = {
  id: number;
  question: GenericQuestion;
  readonly?: boolean;
};

const Question = ({ id, question, readonly = false }: QuestionProps) => {
  function isHighlight(type: TokenType) {
    return [TokenType.FRACTION, TokenType.NUMERIC, TokenType.SPECIAL_CHAR, TokenType.SUPERSCRIPT].includes(type);
  }
  return (
    <div className="question">
      <h4 className="question__header">
        question {id + 1}
        <HelpBox className="question__header__help-box">
          {tokenizeString(question.hint).map((token, i) => (
            <span
              key={i}
              className={classNames("question__header__help-box__token", {
                "--superscript": token.type === TokenType.SUPERSCRIPT,
                "--highlight": isHighlight(token.type),
              })}
            >
              {token.substring}
            </span>
          ))}
        </HelpBox>
      </h4>
      <div className="question__prompt">
        {tokenizeString(question.prompt).map((token, i) => (
          <span key={i} className={classNames("question__prompt__token", { "--highlight": isHighlight(token.type) })}>
            {token.substring}
          </span>
        ))}
      </div>
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
          <div className="question__readonly__proof">
            <b className="question__readonly__proof__token">Explanation</b>:{" "}
            {tokenizeString(question.proof).map((token, i) => (
              <span
                key={i}
                className={classNames("question__readonly__proof__token", {
                  "--highlight": isHighlight(token.type),
                  "--superscript": token.type === TokenType.SUPERSCRIPT,
                })}
              >
                {token.substring}
              </span>
            ))}
          </div>
          <Hr className="question__readonly__hr" />
        </div>
      )}
    </div>
  );
};

export default Question;
