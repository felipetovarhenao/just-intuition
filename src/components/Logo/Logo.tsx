import React from "react";
import logo from "../../assets/logo.png";
import classNames from "classnames";

type LogoProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;

const Logo = ({ className, ...props }: LogoProps) => {
  return <img className={classNames(className, "logo")} src={logo} alt="tuning-fork-logo" {...props} />;
};

export default Logo;
