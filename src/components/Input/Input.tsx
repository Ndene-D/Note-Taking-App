import React from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  small?: boolean;
}

function Input({ error, errorMessage, small, ...inputProps }: InputProps) {
  //   const [width, setWidth] = useState<number>();
  //   const inputRef = useRef(null);

  //   useEffect(() => {
  //     setWidth(inputRef?.current?.clientWidth);
  //   }, [useRef]);

  return (
    <>
      <input className={`${small ? styles.small : ""}`} {...inputProps} />
      {error && (
        <p style={{ fontSize: `calc(100% / 2)`, color: "red" }}>
          {errorMessage}
        </p>
      )}
    </>
  );
}

export default Input;
