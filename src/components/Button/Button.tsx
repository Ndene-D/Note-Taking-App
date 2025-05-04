import { Icon } from "../../assets/Assets";
import { useTheme } from "../Theme/ThemeProvider";
import styles from "./Button.module.css";

interface ButtonModel extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  size?: string;
  alt?: boolean;
  small?: boolean;
  shrink?: boolean;
  secondary?: boolean;
  transparent?: boolean;
  mobileView?: boolean;
  rotateIcon?: number;
}
function Button({
  text,
  icon,
  size,
  alt,
  small,
  shrink,
  secondary,
  transparent,
  rotateIcon,
  mobileView,
  ...buttonProps
}: ButtonModel) {
  const { theme } = useTheme();

  return (
    <button
      className={`${styles.button}  ${
        icon && (text?.length as number) > 0
          ? styles.flex
          : icon
          ? styles.icon
          : ""
      } ${alt ? styles.buttonAlt : ""} ${small ? styles.buttonSmall : ""} ${
        secondary ? styles.secondary : ""
      } ${theme == "light" ? styles.light : ""} ${
        shrink ? styles.shrink : ""
      } ${transparent ? styles.transparent : ""} ${
        mobileView ? styles.mobile : ""
      }`}
      {...(size && { style: { width: size } })}
      {...buttonProps}
    >
      {icon && (
        <Icon
          src={icon}
          {...(rotateIcon && { style: { rotate: `${rotateIcon}deg` } })}
        />
      )}
      {text}
    </button>
  );
}

export default Button;
