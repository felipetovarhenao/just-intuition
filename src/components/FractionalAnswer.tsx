import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { questionActions } from "../redux/questionSlice";

type FractionalAnswerProps = {
  id: number;
};

const FractionalAnswer = ({ id }: FractionalAnswerProps) => {
  const [num, setNum] = useState<number>(0);
  const [den, setDen] = useState<number>(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(questionActions.answer({ id, answer: `${num}/${den}` }));
  }, [num, den]);

  return (
    <div>
      <input onChange={(e) => setNum(Number(e.target.value))} value={num} type="number" min={0} step={1} />
      <input onChange={(e) => setDen(Number(e.target.value))} value={den} type="number" min={1} step={1} />
    </div>
  );
};

export default FractionalAnswer;
