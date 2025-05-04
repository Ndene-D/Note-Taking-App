import { ReactElement } from "react";
import { NoteModel, Tag } from "./NoteModel";
import { IconList } from "./ThemeModel";

export interface LayoutComponent extends React.FC<LayoutModel> {
  PrimaryPanel: React.FC<PrimaryPanelModel>;
  Header: React.FC<HeaderModel>;
  SubPanel: React.FC<SubPanelModal>;
  Container: React.FC<ContainerModel>;
  OptionsPanel: React.FC<OptionsPanel>;
  SettingsContainer: React.FC<SettingsContainerModel>;
}

export interface LayoutModel {
  mobileActiveContainer: boolean;
  children: ReactElement[];
}

interface PrimaryPanelModel {
  selected: string;
  tags: Tag[];
  selectedTags: string[];
  imageList: IconList;
  mobileView: boolean;
  handleNavSwitch: (id: number) => void;
  handleSetTags: (id: string) => void;
}

interface HeaderModel {
  selected: string;
  search: string;
  imageList: IconList;
  mobileView: boolean;
  handleSearch: () => void;
  handleClear: (value: boolean) => void;
  handleNavSwitch: (id: number) => void;
  setSearch: (value: React.SetStateAction<string>) => void;
}

interface SubPanelModal {
  settings: boolean;
  children: ReactElement[];
}

interface ContainerModel
  extends Omit<NoteModel, "id" | "tags" | "archived" | "date"> {
  tags: string;
  selected: boolean;
  note?: NoteModel;
  noteCreation: boolean;
  invalidTitle: boolean;
  tagInvalid: boolean;
  notValidated: boolean;
  imageList: IconList;
  handleNoteCreation: (value: boolean) => void;
  handleSubmission: () => void;
  handleUpdate: () => void;
  handleReset: () => void;
  setTags: (value: React.SetStateAction<string>) => void;
  setTitle: (value: React.SetStateAction<string>) => void;
  setContent: (value: React.SetStateAction<string>) => void;
}

interface OptionsPanel {
  selected: boolean;
  archived?: boolean;
  mobileView: boolean;
  imageList: IconList;
  handleGoBack: () => void;
  handleArchived: () => void;
  handleDeletion: () => void;
}

interface SettingsContainerModel {
  selected: string;
  mobileView: boolean;
  imageList: IconList;
}
