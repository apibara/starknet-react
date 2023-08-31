import { useState } from "react";

export const useClipboard = (code: string) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const copyToClipboard = () => {
    setHasCopied(true);
    navigator.clipboard.writeText(code);

    setTimeout(() => {
      setHasCopied(false);
    }, 500);
  };

  return { copyToClipboard, hasCopied };
};
