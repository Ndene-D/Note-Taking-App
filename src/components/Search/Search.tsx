import styles from "./Search.module.css";
import { Icon } from "../../assets/Assets";

import Button from "../Button/Button";
import { useTheme } from "../Theme/ThemeProvider";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  search: string;
  mobileView?: boolean;
  handleClear: (value: boolean) => void;
  setSearch: (value: React.SetStateAction<string>) => void;
}

function Search({
  search,
  mobileView,
  setSearch,
  handleClear,
  ...inputProps
}: SearchProps) {
  const { imageList } = useTheme();

  return (
    <div
      className={`${styles["search-bar"]} ${mobileView ? styles.mobile : ""}`}
    >
      <Icon src={imageList.search} />
      <input
        placeholder="Search by title, content, or tags..."
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        {...inputProps}
      />

      {search.length > 0 && (
        <Button
          text="X"
          small
          onClick={() => {
            handleClear(true);
          }}
        />
      )}
    </div>
  );
}

export default Search;
