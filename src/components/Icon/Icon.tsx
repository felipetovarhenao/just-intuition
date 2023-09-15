import { Icon as BaseIcon, IconProps as BaseIconProps } from "@iconify/react";
import classNames from "classnames";

type IconProps = BaseIconProps;

const Icon = ({ className, ...props }: IconProps) => {
  return <BaseIcon className={classNames(className, "icon")} {...props} />;
};

export default Icon;
