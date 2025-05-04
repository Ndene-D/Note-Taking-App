/* eslint-disable @typescript-eslint/no-empty-object-type */
import { NoteModel } from "../../models/NoteModel";
import styles from "./note.module.css";
interface NoteCardModel extends Omit<NoteModel, "content" | "archived" | "id"> {
  selected: boolean;
}

function NoteCard({ title, tags, date, selected }: NoteCardModel) {
  return (
    <div className={`${styles.noteCard} ${selected ? styles.active : ""}`}>
      <h3>{title}</h3>
      <div>
        {tags.map((tag) => (
          <span key={tag.id}>{tag.name}</span>
        ))}
      </div>
      <p>
        {new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

export default NoteCard;
