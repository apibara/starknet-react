import { useState } from "react";

export const useBoolean = (initialValue = false) => {
  const [isMounted, setIsMounted] = useState(initialValue);

  const setOn = () => setIsMounted(true);
  const setOff = () => setIsMounted(false);
  const toggle = () => setIsMounted((prevValue) => !prevValue);

  return { isMounted, setOn, setOff, toggle };
};
