import "./FractionalAnswer.scss";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { questionActions } from "../../redux/questionSlice";

type FractionalAnswerProps = {
  id: number;
};

const FractionalAnswer = ({ id }: FractionalAnswerProps) => {
  const [num, setNum] = useState<number>(0);
  const [den, setDen] = useState<number>(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (den === 0) {
      return;
    }
    dispatch(questionActions.answer({ id, answer: `${num}/${den}` }));
  }, [num, den]);

  return (
    <div className="fractional-answer">
      <input
        className="fractional-answer__input --numerator"
        onChange={(e) => setNum(Number(e.target.value))}
        value={num}
        type="number"
        min={0}
        max={99}
        step={1}
      />
      <input
        className="fractional-answer__input --denominator"
        onChange={(e) => {
          const x = Number(e.target.value);
          if (x > 0) {
            setDen(Number(e.target.value));
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
