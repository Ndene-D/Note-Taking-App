import { Icon } from "../../assets/Assets";
import styles from "./SelectionButton.module.css";

interface SelectionButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  img: string;
  title: string;
  description: string;
  active?: boolean;
  mobileView?: boolean;
}

function SelectionButton({
  img,
  title,
  description,
  active,
  mobileView,
  ...divProps
}: SelectionButtonProps) {
  return (
    <div
      className={`${styles.selectionButton}  ${
        mobileView && active ? styles.active : ""
      }`}
      {...divProps}
    >
      <div className={styles.icon}>
        <Icon src={img} width={24} height={24} />
      </div>

      <div>
        <h4>{title}</h4>
        <span>{description}</span>
      </div>

      {!mobileView && (
        <div className={styles.circle}>
          <div className={`${active ? styles.active : ""}`}></div>
        </div>
      )}
    </div>
  );
}

export default SelectionButton;
