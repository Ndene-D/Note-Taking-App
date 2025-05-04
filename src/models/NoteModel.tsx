export interface NoteModel {
  id: string;
  title: string;
  content: string;
  date: number;
  tags: Omit<Tag[], "name">;
  archived: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface SelectedModel {
  id: string;
  index: number;
}
