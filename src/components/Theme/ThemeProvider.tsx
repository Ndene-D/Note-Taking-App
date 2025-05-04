import {
  ReactElement,
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import styles from "./theme.module.css";
import Archive from "../../assets/archive.svg";
import DarkArchive from "../../assets/archive-dark.svg";
import ArchiveOut from "../../assets/archive-180.svg";
import DarkArchiveOut from "../../assets/archive-dark-180.svg";
import Brightness from "../../assets/brightness.svg";
import BrightnessDark from "../../assets/brightness-dark.svg";
import Clock from "../../assets/clock.svg";
import ClockDark from "../../assets/clock-dark.svg";
import Moon from "../../assets/dark.svg";
import MoonDark from "../../assets/dark-dark.svg";
import Font from "../../assets/font.svg";
import FontDark from "../../assets/font-dark.svg";
import Home from "../../assets/home.svg";
import HomeDark from "../../assets/home-dark.svg";
import Notes from "../../assets/notes.svg";
import NotesDark from "../../assets/notes-dark.svg";
import RightArrow from "../../assets/right-arrow.svg";
import RightArrowDark from "../../assets/right-arrow-dark.svg";
import Search from "../../assets/search.svg";
import SearchDark from "../../assets/search-dark.svg";
import Settings from "../../assets/settings.svg";
import SettingsDark from "../../assets/settings-dark.svg";
import Tag from "../../assets/tag.svg";
import TagDark from "../../assets/tag-dark.svg";
import Trash from "../../assets/trash.svg";
import TrashDark from "../../assets/trash-dark.svg";

import { IconList } from "../../models/ThemeModel";

interface ThemeContextModel {
  theme: string;
  font: string;
  imageList: IconList;
  handleTheme: (theme: string) => void;
  handleFont: (font: string) => void;
}

interface ThemeProviderModel {
  children: ReactElement;
}

interface StoredThemeModel {
  theme: string;
  font: string;
  initial: boolean;
}

const ThemeContext = createContext({} as ThemeContextModel);
export const useTheme = () => useContext(ThemeContext);

const isSystemDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

export const fonts = {
  sansSerif: styles["sans-serif"],
  notoSerif: styles["noto-serif"],
  monospace: styles.monospace,
};
function ThemeProvider({ children }: ThemeProviderModel) {
  const [theme, setTheme] = useState<string>("");
  const [font, setFont] = useState<string>("");
  // const [initial, setInitial] = useState<boolean | null>(null);

  const handleTheme = (mode: string) => {
    setTheme(mode);
  };

  const handleStoringTheme = () => {
    if (theme.length == 0 && font.length == 0) {
      setTheme(isSystemDarkMode ? "dark" : "light");
      setFont(fonts.monospace);
    }

    if (theme.length != 0 && font.length != 0) {
      localStorage.setItem("theme", JSON.stringify({ theme, font }));
    }
  };

  const handleGetStoredTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      const format = JSON.parse(storedTheme) as StoredThemeModel;
      handleTheme(format.theme);
      handleFont(format.font);
    }
  };

  const handleFont = (font: string) => {
    if (font.includes("sans-serif")) {
      setFont(fonts.sansSerif);
    } else if (font.includes("noto-serif")) {
      setFont(fonts.notoSerif);
    } else if (font.includes("monospace")) {
      setFont(fonts.monospace);
    }
  };

  const imageList = {
    archive: theme == "light" ? DarkArchive : Archive,
    archiveOut: theme == "light" ? DarkArchiveOut : ArchiveOut,
    brightness: theme == "light" ? BrightnessDark : Brightness,
    clock: theme == "light" ? ClockDark : Clock,
    moon: theme == "light" ? MoonDark : Moon,
    font: theme == "light" ? FontDark : Font,
    home: theme == "light" ? HomeDark : Home,
    notes: theme == "light" ? NotesDark : Notes,
    rightArrow: theme == "light" ? RightArrowDark : RightArrow,
    search: theme == "light" ? SearchDark : Search,
    settings: theme == "light" ? SettingsDark : Settings,
    tag: theme == "light" ? TagDark : Tag,
    trash: theme == "light" ? TrashDark : Trash,
  };

  useEffect(() => {
    handleStoringTheme();
  }, [theme, font]);

  useEffect(() => {
    handleGetStoredTheme();
  }, []);

  const value = useMemo(
    () => ({
      theme,
      font,
      imageList,
      handleTheme,
      handleFont,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className={`${theme} ${font}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
