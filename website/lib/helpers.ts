import { useState } from "react";

export const useBoolean = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const setOn = () => setValue(true);
  const setOff = () => setValue(false);
  const toggle = () => setValue((prevValue) => !prevValue);

  return { value, setOn, setOff, toggle };
};
