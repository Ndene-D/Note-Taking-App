import { Icon } from "../../assets/Assets";
import styles from "./Descriptions.module.css";

interface DescriptionsModel {
  icon: string;
  description: string;
}

function Descriptions({ icon, description }: DescriptionsModel) {
  return (
    <div className={styles.descriptions}>
      <Icon src={icon} />
      <span>{description}</span>
    </div>
  );
}

export default Descriptions;
