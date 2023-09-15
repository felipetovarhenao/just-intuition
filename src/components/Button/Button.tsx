import classNames from "classnames";
import "./Button.scss";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={classNames(className, "button")} {...props}>
      {children}
    </button>
  );
};

export default Button;
