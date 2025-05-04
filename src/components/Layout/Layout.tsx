/* eslint-disable react-hooks/rules-of-hooks */
import styles from "./Layout.module.css";
import { Icon } from "../../assets/Assets";
// import { imageList } from "../Theme/Images";
import { LayoutComponent, LayoutModel } from "../../models/LayoutModel";
import Search from "../Search/Search";
import Button from "../Button/Button";
import Descriptions from "../Descriptions/Descriptions";
import { useEffect, useState } from "react";
import Input from "../Input/Input";
import SelectionButton from "../SelectionButton/SelectionButton";
import { useTheme } from "../Theme/ThemeProvider";
import TagList from "../TagList/TagList";

const Layout: LayoutComponent = ({
  mobileActiveContainer,
  children,
}: LayoutModel) => (
  <div
    className={`${styles.layout} ${
      mobileActiveContainer ? styles["active-container"] : ""
    }`}
  >
    {children}
  </div>
);

Layout.PrimaryPanel = ({
  selected,
  tags,
  selectedTags,
  imageList,
  mobileView,
  handleNavSwitch,
  handleSetTags,
}) => {
  return (
    <aside className={`${styles.primaryPanel}`}>
      {!mobileView && <Icon src={imageList.notes} width={100} />}
      <nav className={styles["nav-items"]}>
        <ul>
          <li
            className={
              selected == "All Notes" || selected == "Home" ? styles.active : ""
            }
            onClick={() => handleNavSwitch(0)}
          >
            <Icon src={imageList.home} />
            <h4>{mobileView ? "Home" : "All Notes"}</h4>
            {(selected == "All Notes" || selected == "Home") && !mobileView && (
              <Icon src={imageList.rightArrow} />
            )}
          </li>

          {mobileView && (
            <>
              <hr />
              <li
                className={selected == "Search" ? styles.active : ""}
                onClick={() => handleNavSwitch(1)}
              >
                <Icon src={imageList.search} />
                <h4>Search</h4>
              </li>
            </>
          )}

          {mobileView && <hr />}
          <li
            className={
              selected == "Archived Notes" || selected == "Archived"
                ? styles.active
                : ""
            }
            onClick={() => handleNavSwitch(mobileView ? 2 : 1)}
          >
            <Icon src={imageList.archive} />
            <h4>{mobileView ? "Archived" : "Archived Notes"}</h4>
            {(selected == "Archived Notes" || selected == "Archived") &&
              !mobileView && <Icon src={imageList.rightArrow} />}
          </li>

          {mobileView && (
            <>
              <hr />
              <li
                className={selected == "Tags" ? styles.active : ""}
                onClick={() => handleNavSwitch(3)}
              >
                <Icon src={imageList.tag} />
                <h4>Tags</h4>
              </li>
            </>
          )}

          {mobileView && (
            <>
              <hr />
              <li
                className={selected == "Settings" ? styles.active : ""}
                onClick={() => handleNavSwitch(4)}
              >
                <Icon src={imageList.settings} />
                <h4>Settings</h4>
              </li>
            </>
          )}
        </ul>

        {!mobileView && (
          <>
            <hr /> <span>Tags</span>
            <TagList
              tags={tags}
              selectedTags={selectedTags}
              imageList={imageList}
              handleSetTags={handleSetTags}
            />
          </>
        )}
      </nav>
    </aside>
  );
};
Layout.Header = ({
  search,
  selected,
  imageList,
  mobileView,
  handleNavSwitch,
  handleClear,
  setSearch,
}) => {
  return (
    <header className={`${styles.header} ${mobileView ? styles.mobile : ""}`}>
      {!mobileView ? (
        <>
          <h1>{selected}</h1>
          <div>
            <Search
              search={search}
              setSearch={setSearch}
              handleClear={handleClear}
            />
            <Icon
              onClick={() => handleNavSwitch(4)}
              src={imageList.settings}
              width={34}
              height={34}
            />
          </div>
        </>
      ) : (
        <Icon src={imageList.notes} />
      )}
    </header>
  );
};
Layout.SubPanel = ({ settings, children }) => (
  <aside className={`${styles.notesPanel} ${settings ? styles.settings : ""}`}>
    {children}
  </aside>
);
Layout.Container = ({
  note,
  selected,
  noteCreation,
  title,
  invalidTitle,
  content,
  tags,
  tagInvalid,
  notValidated,
  imageList,
  handleNoteCreation,
  handleSubmission,
  handleUpdate,
  handleReset,
  setTitle,
  setTags,
  setContent,
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [enableNoteEdit, setEnableNoteEdit] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);

  // const contentRef = useRef(null);

  const handleNoteEdit = (value: boolean) => {
    setEnableNoteEdit(value);
  };

  useEffect(() => {
    if (!notValidated && submit && noteCreation) handleSubmission();
    else if (!notValidated && submit && enableNoteEdit) {
      handleUpdate();
      setEnableNoteEdit(false);
    }

    setSubmit(false);
  }, [submit]);

  // useEffect(() => {
  //   if (tagInputRef.current) {
  //     tagInputRef.current.setCustomValidity(
  //       "Only 3 tags max 8 characters, separate each one by comma"
  //     );
  //   }
  // }, []);

  useEffect(() => {
    if (enableNoteEdit) {
      const tags =
        (note?.tags ?? []).length > 1
          ? note?.tags.map((tag) => tag.name).join(", ")
          : (note?.tags ?? [])[0]?.name ?? "";
      setTitle(note?.title as string);
      setTags(tags as string);
      setContent(note?.content as string);
    }
  }, [enableNoteEdit]);

  useEffect(() => {
    if (noteCreation) {
      handleReset();
      handleNoteEdit(false);
    }
  }, [noteCreation]);

  return (
    <>
      {(selected || noteCreation) && (
        <main className={styles.notesContainer}>
          <form action="">
            <div>
              {enableNoteEdit || noteCreation ? (
                <Input
                  value={title}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) setTitle(e.target.value);
                    // handleValidation(0);
                  }}
                  type="text"
                  error={invalidTitle}
                  errorMessage="Only letters and single spaces allowed. Max 50 characters."
                  required
                />
              ) : (
                <h1 onClick={() => !note?.archived && handleNoteEdit(true)}>
                  {note?.title}
                </h1>
              )}
              <div className={styles.tags}>
                <Descriptions icon={imageList.tag} description="Tags" />
                <Descriptions
                  icon={imageList.clock}
                  description="Last Edited"
                />
                {!enableNoteEdit && !noteCreation ? (
                  <span onClick={() => !note?.archived && handleNoteEdit(true)}>
                    {(note?.tags ?? []).length > 1
                      ? note?.tags.map((tag) => tag.name).join(", ")
                      : (note?.tags ?? [])[0]?.name ?? ""}
                  </span>
                ) : (
                  <div>
                    <Input
                      value={tags}
                      onChange={(e) => {
                        setTags(e.target.value);
                        // handleValidation(1);
                      }}
                      errorMessage="Separate by comma, only 8 characters. Max 3 tags."
                      error={tagInvalid}
                      small
                    />
                  </div>
                )}

                {!noteCreation && (
                  <span>
                    {new Date(note?.date ?? "").toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
            <hr />
            {!enableNoteEdit && !noteCreation ? (
              <article onClick={() => !note?.archived && handleNoteEdit(true)}>
                {note?.content}
              </article>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            )}
            <hr />
            {(enableNoteEdit || noteCreation) && (
              <div className={styles.buttons}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setSubmit(true);
                  }}
                  text={noteCreation ? "Submit" : "Update"}
                  small
                  type="submit"
                  disabled={notValidated}
                />
                <Button
                  text="Cancel"
                  small
                  secondary
                  onClick={() =>
                    enableNoteEdit
                      ? handleNoteEdit(false)
                      : handleNoteCreation(false)
                  }
                />
              </div>
            )}
          </form>
        </main>
      )}
    </>
  );
};
Layout.OptionsPanel = ({
  selected,
  imageList,
  mobileView,
  handleGoBack,
  handleArchived,
  handleDeletion,
  archived,
}) =>
  selected && (
    <aside className={styles.optionsPanel}>
      {mobileView ? (
        <>
          <div>
            <Button
              text="Go Back"
              icon={imageList.rightArrow}
              rotateIcon={180}
              shrink
              transparent
              onClick={handleGoBack}
            />
          </div>
          <div className={styles.btns}>
            <Button
              onClick={handleDeletion}
              icon={imageList.trash}
              shrink
              transparent
            />
            <Button
              onClick={handleArchived}
              icon={archived ? imageList.archiveOut : imageList.archive}
              shrink
              transparent
            />
          </div>
        </>
      ) : (
        <>
          <Button
            text={archived ? "Unarchive Note" : "Archive Note"}
            icon={archived ? imageList.archiveOut : imageList.archive}
            onClick={handleArchived}
            alt
          />
          <Button
            text="Delete Note"
            icon={imageList.trash}
            onClick={handleDeletion}
            alt
          />
        </>
      )}
    </aside>
  );

Layout.SettingsContainer = ({ selected, mobileView, imageList }) => {
  const { theme, font, handleTheme, handleFont } = useTheme();
  const [colorSelection, setColorSelection] = useState<number>(
    theme == "light" ? 0 : 1
  );
  const [fontSelection, setFontSelection] = useState<string>(
    font.split("_")[1]
  );

  return (
    <main className={styles.settingsContainer}>
      {selected == "Color Theme" ? (
        <>
          <div className={styles.content}>
            <h3>Color Theme</h3>
            <span>Choose your color theme:</span>
          </div>

          <SelectionButton
            img={imageList.brightness}
            title="Light Theme"
            description="Pick a clean and classic light theme."
            active={colorSelection === 0}
            mobileView={mobileView}
            onClick={() => setColorSelection(0)}
          />
          <SelectionButton
            img={imageList.moon}
            title="Dark Theme"
            description="Select a sleek and modern dark theme."
            active={colorSelection === 1}
            mobileView={mobileView}
            onClick={() => setColorSelection(1)}
          />

          <Button
            onClick={() => handleTheme(colorSelection === 0 ? "light" : "dark")}
            text="Apply"
            size="25%"
            small
          />
        </>
      ) : (
        <>
          <div className={styles.content}>
            <h3>Font Theme</h3>
            <span>Choose your font theme:</span>
          </div>

          <SelectionButton
            img={imageList.font}
            title="Sans Serif"
            description="Clean and modern, easy to read."
            active={fontSelection == "sans-serif"}
            mobileView={mobileView}
            onClick={() => setFontSelection("sans-serif")}
          />
          <SelectionButton
            img={imageList.font}
            title="Noto Serif"
            description="Classic and elegant for timeless feel."
            active={fontSelection == "noto-serif"}
            mobileView={mobileView}
            onClick={() => setFontSelection("noto-serif")}
          />

          <SelectionButton
            img={imageList.font}
            title="Monospace"
            description="Code-like, great for technical vibe."
            active={fontSelection == "monospace"}
            mobileView={mobileView}
            onClick={() => setFontSelection("monospace")}
          />

          <Button
            onClick={() => handleFont(fontSelection)}
            text="Apply"
            size="25%"
            small
          />
        </>
      )}
    </main>
  );
};
export default Layout;
