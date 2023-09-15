import "./FractionalAnswer.scss";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { questionActions } from "../../redux/questionSlice";
import FractionOp from "../../utils/FractionOp";
import Hr from "../Hr/Hr";

type FractionalAnswerProps = {
  id: number;
};

const FractionalAnswer = ({ id }: FractionalAnswerProps) => {
  const [num, setNum] = useState("");
  const [den, setDen] = useState("");
  const dispatch = useAppDispatch();

  function validateInput(next: string, prev: string) {
    if (!next) {
      return next;
    } else if (/^[0-9]{1,2}$/.test(next)) {
      return next;
    } else {
      return prev;
    }
  }

  useEffect(() => {
    if (den === "0") {
      return;
    }
    const f = FractionOp.reduce({ n: Number(num), d: Number(den) });
    dispatch(questionActions.answer({ id, answer: FractionOp.toString(f) }));
  }, [num, den]);

  return (
    <div className="fractional-answer">
      <input
        className="fractional-answer__input --numerator"
        onChange={(e) => setNum(validateInput(e.target.value, num))}
        value={num}
        type="number"
        min={0}
        max={99}
        step={1}
      />
      <Hr className="fractional-answer__hr" />
      <input
        className="fractional-answer__input --denominator"
        onChange={(e) => {
          const x = Number(e.target.value);
          if (x > 0) {
            setDen(validateInput(e.target.value, den));
          }
        }}
        value={den}
        type="number"
        min={1}
        max={99}
        step={1}
      />
    </div>
  );
};

export default FractionalAnswer;
