import "./ProgressBar.scss";
import classNames from "classnames";

type ProgressBarProps = {
  className?: string;
  value: number;
};
const ProgressBar = ({ className, value }: ProgressBarProps) => {
  const getColorClass = () => {
    if (value ** 2 < 1 / 3) {
      return "low";
    } else if (value ** 2 < 2 / 3) {
      return "mid";
    } else {
      return "high";
    }
  };
  return (
    <div style={{ maxHeight: "5px" }} className={classNames(className, "progress-bar", `--${getColorClass()}`)}>
      <div style={{ width: `${value * 100}%` }} className="progress-bar__inner" />
    </div>
  );
};

export default ProgressBar;
