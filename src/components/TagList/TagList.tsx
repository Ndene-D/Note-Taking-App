import React from "react";
import { Tag } from "../../models/NoteModel";
import styles from "./TagList.module.css";
import { IconList } from "../../models/ThemeModel";
import { Icon } from "../../assets/Assets";

interface TagListProps {
  tags: Tag[];
  selectedTags: string[];
  column?: boolean;
  mobileView?: boolean;
  imageList: IconList;
  handleSetTags: (id: string) => void;
}
function TagList({
  tags,
  selectedTags,
  column,
  mobileView,
  imageList,
  handleSetTags,
}: TagListProps) {
  return (
    <div className={styles.tags}>
      <ul>
        {tags.map((tag) => (
          <li
            className={`${selectedTags.includes(tag.id) ? styles.active : ""} ${
              column ? styles.column : ""
            } ${mobileView ? styles.mobile : ""}`}
            key={tag.id}
            onClick={() => handleSetTags(tag.id)}
          >
            <Icon src={imageList.tag} />
            <h4>{tag.name}</h4>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TagList;
