import "./FractionalAnswer.scss";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { questionActions } from "../../redux/questionSlice";
import Hr from "../Hr/Hr";

type FractionalAnswerProps = {
  id: number;
};

const FractionalAnswer = ({ id }: FractionalAnswerProps) => {
  const [num, setNum] = useState("");
  const [den, setDen] = useState("");
  const dispatch = useAppDispatch();

  function removeNonDigits(input: string): string {
    if (!input) {
      return input;
    } else {
      const num = String(Number(input.replace(/\D/g, ""))).slice(0, 2);
      return num;
    }
  }

  useEffect(() => {
    const answer = num && den ? `${num}/${den}` : undefined;
    dispatch(questionActions.answer({ id, answer }));
  }, [num, den]);

  function omitSymbols(e: React.KeyboardEvent<HTMLInputElement>) {
    if (/(\.|\-|\+|\,|\`)/.test(e.key)) {
      e.preventDefault();
    }
  }

  return (
    <div className="fractional-answer">
      <input
        className="fractional-answer__input --numerator"
        onChange={(e) => setNum(removeNonDigits(e.target.value))}
        value={num}
        type="number"
        maxLength={2}
        placeholder="1"
        onKeyDown={omitSymbols}
        step={1}
      />
      <Hr className="fractional-answer__hr" />
      <input
        className="fractional-answer__input --denominator"
        onChange={(e) => setDen(removeNonDigits(e.target.value))}
        value={den}
        type="number"
        maxLength={2}
        placeholder="2"
        onKeyDown={omitSymbols}
        step={1}
      />
    </div>
  );
};

export default FractionalAnswer;
