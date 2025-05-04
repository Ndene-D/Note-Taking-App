/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { uid } from "uid";
import { NoteModel, SelectedModel, Tag } from "./models/NoteModel";
import Button from "./components/Button/Button";
import NoteCard from "./components/NoteCard/NoteCard";
import styles from "./components/Layout/Layout.module.css";
import { Icon } from "./assets/Assets";

import { useTheme } from "./components/Theme/ThemeProvider";
import { getWindowSize } from "./utils/windowSize";
import Search from "./components/Search/Search";
import TagList from "./components/TagList/TagList";

function App() {
  const [navSelection, setNavSelection] = useState<string>("All Notes");
  const [settingsSelection, setSettingsSelection] =
    useState<string>("Color Theme");
  const [navSwitch, setNavSwitch] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [notValidated, setNotValidated] = useState<boolean>(true);
  const [titleInitial, setTitleInitial] = useState<boolean>(true);
  const [invalidTitle, setInvalidTitle] = useState<boolean>(false);
  const [tagsInitial, setTagsInitial] = useState<boolean>(true);
  const [tagInvalid, setTagInvalid] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<SelectedModel>(
    {} as SelectedModel
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([""]);
  const [enableNoteCreation, setEnableNoteCreation] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);

  const [search, setSearch] = useState<string>("");
  const [clearSearch, setClearSearch] = useState<boolean>(false);
  const [searchedItems, setSearchedItems] = useState<NoteModel[]>(notes);

  const [mobileView, setMobileView] = useState<boolean>(false);

  const { imageList } = useTheme();

  const width = getWindowSize();

  const handleNavSelection = (selected: string) => {
    setNavSelection(selected);
  };

  const handleSettingsSelection = (selected: string) => {
    setSettingsSelection(selected);
  };

  const handleNavSwitch = (id: number) => {
    setNavSwitch(id);
  };

  const handleSetNote = (id: string, index: number) => {
    setSelectedNote({ id, index });
    setEnableNoteCreation(false);
  };

  const handleSetTags = (id: string) => {
    const findTag = selectedTags.find((tag) => tag == id);

    if (!findTag) {
      setSelectedTags((_preval: string[]) => [...selectedTags, id]);
    } else if (findTag) {
      setSelectedTags((_preval: string[]) =>
        selectedTags.filter((tag) => tag !== id)
      );
    }

    if (mobileView) {
      handleNavSwitch(0);
    }
  };

  const handleNoteCreation = (value: boolean) => {
    setEnableNoteCreation(value);
  };

  const handleValidateTags = (value: string) => {
    const tagValidation = value.match(
      /^[A-Za-z]{1,8}(?:, [A-Za-z]{1,8}){0,2}$/i
    );

    setTagInvalid(tagValidation == null);
  };

  const handleValidateTitle = (value: string) => {
    const invalidTitle = value
      .trimEnd()
      .match(/^(?=.{1,50}$)[A-Za-z]+( [A-Za-z]+)*$/);

    setInvalidTitle(invalidTitle == null);
  };

  const handleValidation = () => {
    if (invalidTitle || tagInvalid || tagsInitial || titleInitial) {
      setNotValidated(true);
    } else {
      setNotValidated(false);
    }
  };

  const handleCheckTags = () => {
    const tagCheck = tags.includes(",")
      ? tags.split(",").map((tag) => {
          return {
            id: tagList.find((id) => tag.trim() == id.name)?.id ?? uid(),
            name: tag.trim(),
          };
        })
      : [
          {
            id: tagList.find((id) => tags == id.name)?.id ?? uid(),
            name: tags,
          },
        ];

    const getNewTags = tagCheck.filter(
      (tag) => !tagList.some((secTag) => tag.name === secTag.name)
    );

    setTagList((_preval: Tag[]) => [...tagList, ...getNewTags]);

    return tagCheck;
  };

  const handleGoBack = () => {
    handleReset();
    setSelectedNote({} as SelectedModel);
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setTags("");
    setNotValidated(true);
    setTitleInitial(true);
    setTagsInitial(true);
    setInvalidTitle(false);
    setTagInvalid(false);
  };

  const handleSubmission = () => {
    const getTag = handleCheckTags();

    const createNote = {
      id: uid(),
      title,
      content,
      date: Date.now(),
      tags: getTag,
      archived: false,
    };

    setNotes((_preval: NoteModel[]) => [createNote, ...notes]);

    handleReset();

    setEnableNoteCreation(false);
  };

  const handleUpdate = () => {
    const getTags = handleCheckTags();

    setNotes((_preval: NoteModel[]) =>
      _preval.map((note) => {
        return note.id == selectedNote.id
          ? { ...note, title, tags: getTags, content, date: Date.now() }
          : note;
      })
    );
  };

  const handleDeletion = () => {
    const removeTag = [] as string[];

    const currentNoteTags = notes[selectedNote.index].tags;

    const allTags = notes
      .map((note) => note.tags.filter((tag) => currentNoteTags.includes(tag)))
      .flat(Infinity) as Tag[];

    for (let i = 0; i < currentNoteTags.length; i++) {
      let count = 0;
      for (let k = 0; k < allTags.length; k++) {
        if (currentNoteTags[i].id == allTags[k].id) {
          count++;
        }
      }
      if (count <= 1) {
        removeTag.push(currentNoteTags[i].id);
      }
    }

    setSelectedTags((_preval: string[]) =>
      selectedTags.filter((id) => !removeTag.includes(id))
    );

    setTagList((_preval: Tag[]) =>
      tagList.filter((tag) => !removeTag.includes(tag.id))
    );

    setNotes((_preval: NoteModel[]) =>
      notes.filter((note) => note.id !== selectedNote.id)
    );
    setSelectedNote({} as SelectedModel);
  };

  const handleArchivedNote = () => {
    setNotes((_preval: NoteModel[]) =>
      _preval.map((note) => {
        return note.id == selectedNote.id
          ? { ...note, archived: !note.archived }
          : note;
      })
    );
    setSelectedNote({} as SelectedModel);
  };

  const handleSearch = () => {
    const searchQuery = notes.filter((note) => {
      const tagNames = note.tags.map((tag) => tag.name);
      return (
        note.content.includes(search) ||
        note.title.includes(search) ||
        tagNames.includes(search)
      );
    });

    setSearchedItems(searchQuery);

    // note.tags.filter((tag) => tag.name.includes(search))
  };

  const handleClearSearch = (value: boolean) => {
    setClearSearch(value);
  };

  const handleStoredData = () => {
    let storedNotes;
    let storedTags;

    try {
      storedNotes = JSON.parse(localStorage.getItem("notes") || "");
    } catch (error) {
      console.info("No notes");
    }

    try {
      storedTags = JSON.parse(localStorage.getItem("tags") || "");
    } catch (error) {
      console.info("No tags");
    }

    if (storedNotes) {
      setNotes(storedNotes);
      setSearchedItems(storedNotes);
    }
    if (storedTags) setTagList(storedTags);
  };

  const handleStoringData = () => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("tags", JSON.stringify(tagList));
  };

  useEffect(() => {
    setSearchedItems(notes);
  }, [notes]);

  useEffect(() => {
    if (clearSearch) {
      setSearch("");
      setClearSearch(false);
    }
  }, [clearSearch]);

  useEffect(() => {
    handleSearch();
  }, [search]);

  useEffect(() => {
    if (!titleInitial) {
      handleValidateTitle(title);
      handleValidation();
    }
    if (titleInitial) setTitleInitial(false);
  }, [title]);

  useEffect(() => {
    if (!tagsInitial) {
      handleValidateTags(tags);
      handleValidation();
    }
    if (tagsInitial) setTagsInitial(false);
  }, [tags]);

  useEffect(() => {
    if (navSwitch == 0 && mobileView) {
      handleNavSelection("Home");
    } else if (navSwitch == 0) {
      handleNavSelection("All Notes");
    } else if (navSwitch == 1 && mobileView) {
      handleNavSelection("Search");
      if (selectedTags.length > 1) {
        setSelectedTags([""]);
      }
    } else if (navSwitch == 1) {
      handleNavSelection("Archived Notes");
    } else if (navSwitch == 2 && mobileView) {
      handleNavSelection("Archived");
    } else if (navSwitch == 3 && mobileView) {
      handleNavSelection("Tags");
    } else if (navSwitch == 4) {
      handleNavSelection("Settings");
    }

    setSelectedNote({} as SelectedModel);
  }, [navSwitch]);

  useEffect(() => {
    if (!initial) {
      handleStoringData();
    } else {
      setInitial(false);
    }
  }, [handleDeletion, handleNoteCreation, handleUpdate, handleArchivedNote]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    handleStoredData();
  }, []);

  useEffect(() => {
    if (width <= 1024) {
      setMobileView(true);
    } else if (width >= 1025) {
      setMobileView(false);
    }
  }, [width]);

  // useEffect(() => {
  //   handleGetNote();
  // }, [selectedNote]);

  return (
    <Layout
      mobileActiveContainer={
        Object.keys(selectedNote).length !== 0 && mobileView
      }
    >
      <Layout.Header
        search={search}
        selected={navSelection}
        imageList={imageList}
        mobileView={mobileView}
        handleNavSwitch={handleNavSwitch}
        handleSearch={handleSearch}
        handleClear={handleClearSearch}
        setSearch={setSearch}
      ></Layout.Header>
      <Layout.PrimaryPanel
        selected={navSelection}
        tags={tagList}
        selectedTags={selectedTags}
        imageList={imageList}
        mobileView={mobileView}
        handleNavSwitch={handleNavSwitch}
        handleSetTags={handleSetTags}
      ></Layout.PrimaryPanel>
      <>
        {Object.keys(selectedNote).length !== 0 && mobileView ? (
          <></>
        ) : (
          <Layout.SubPanel settings={navSelection == "Settings"}>
            <>
              {navSelection == "All Notes" && !mobileView && (
                <Button
                  text="Create New Note"
                  onClick={() => handleNoteCreation(true)}
                ></Button>
              )}
            </>

            <>
              {navSelection == "Tags" && mobileView && (
                <TagList
                  tags={tagList}
                  selectedTags={selectedTags}
                  imageList={imageList}
                  handleSetTags={handleSetTags}
                  mobileView
                />
              )}
            </>
            <>
              {navSelection == "Search" && mobileView && (
                <Search
                  search={search}
                  mobileView
                  setSearch={setSearch}
                  handleClear={handleClearSearch}
                />
              )}
            </>

            <div>
              {notes
                .map((note) => note.archived)
                .every((value) => value === false) &&
                navSelection == "Archived" && <h3>No Archived Notes</h3>}

              {searchedItems.map((note) => {
                const findNote = notes.findIndex((n) => n.id == note.id);

                const availableTags =
                  selectedTags.length === 1
                    ? true
                    : note.tags.find((tag) => selectedTags.includes(tag.id));

                if (
                  (navSelection == "Archived Notes" ||
                    navSelection == "Archived" ||
                    navSelection == "Search") &&
                  note.archived &&
                  availableTags
                ) {
                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSetNote(note.id, findNote)}
                    >
                      <NoteCard
                        title={note.title}
                        tags={note.tags}
                        date={note.date}
                        selected={note.id == selectedNote.id}
                      />
                    </div>
                  );
                } else if (
                  (navSelection == "All Notes" ||
                    navSelection == "Home" ||
                    navSelection == "Search") &&
                  !note.archived &&
                  availableTags
                ) {
                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSetNote(note.id, findNote)}
                    >
                      <NoteCard
                        title={note.title}
                        tags={note.tags}
                        date={note.date}
                        selected={note.id == selectedNote.id}
                      />
                    </div>
                  );
                }
              })}
            </div>

            <>
              {navSelection == "Settings" && (
                <>
                  <nav className={styles["nav-items"]}>
                    <ul>
                      <li
                        className={
                          settingsSelection == "Color Theme"
                            ? styles.active
                            : ""
                        }
                        onClick={() => handleSettingsSelection("Color Theme")}
                      >
                        {mobileView ? (
                          <Button
                            icon={imageList.brightness}
                            shrink
                            transparent
                          />
                        ) : (
                          <Icon src={imageList.brightness} />
                        )}
                        {!mobileView && (
                          <>
                            <h4>Color Theme</h4>{" "}
                            <Icon src={imageList.rightArrow} />
                          </>
                        )}
                      </li>

                      <li
                        className={
                          settingsSelection == "Font Theme" ? styles.active : ""
                        }
                        onClick={() => handleSettingsSelection("Font Theme")}
                      >
                        {mobileView ? (
                          <Button icon={imageList.font} shrink transparent />
                        ) : (
                          <Icon src={imageList.font} />
                        )}
                        {!mobileView && (
                          <>
                            <h4>Font Theme</h4>
                            <Icon src={imageList.rightArrow} />
                          </>
                        )}
                      </li>
                    </ul>
                  </nav>
                </>
              )}
            </>
          </Layout.SubPanel>
        )}
      </>
      {navSelection !== "Settings" ? (
        <Layout.Container
          noteCreation={enableNoteCreation}
          selected={Object.keys(selectedNote).length > 0}
          note={
            !enableNoteCreation ? notes[selectedNote.index] : ({} as NoteModel)
          }
          title={title}
          invalidTitle={invalidTitle}
          content={content}
          tags={tags}
          tagInvalid={tagInvalid}
          notValidated={notValidated}
          imageList={imageList}
          handleNoteCreation={handleNoteCreation}
          handleSubmission={handleSubmission}
          handleUpdate={handleUpdate}
          handleReset={handleReset}
          setContent={setContent}
          setTitle={setTitle}
          setTags={setTags}
        />
      ) : (
        <Layout.SettingsContainer
          selected={settingsSelection}
          mobileView={mobileView}
          imageList={imageList}
        />
      )}

      <>
        {" "}
        {!enableNoteCreation && (
          <Layout.OptionsPanel
            selected={Object.keys(selectedNote).length > 0}
            imageList={imageList}
            mobileView={mobileView}
            handleGoBack={handleGoBack}
            handleArchived={handleArchivedNote}
            handleDeletion={handleDeletion}
            archived={notes[selectedNote.index]?.archived}
          ></Layout.OptionsPanel>
        )}
      </>
    </Layout>
  );
}

export default App;
