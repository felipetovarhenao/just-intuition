import { useState, ReactNode } from "react";
import "./HelpBox.scss";
import classNames from "classnames";
import Icon from "../Icon/Icon";

interface HelpBoxProps {
  icon?: string;
  children: ReactNode;
  className?: string;
}

export default function HelpBox({ icon = "material-symbols:help", children, className, ...rest }: HelpBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div className={classNames(className, "help-box")} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...rest}>
      <Icon icon={icon} className="icon" />
      {isOpen && <div className="help-box-inner">{children}</div>}
    </div>
  );
}
