"use client";
import React, { useEffect, useMemo } from "react";

import { trimCode } from "@/lib/helpers/trimCode";
import { useBoolean } from "@/lib/hooks/useBoolean";

import ReactLiveBlock from "./live";
import { useCodeTheme } from "./styles";

type ToggleState = {
  isMounted: boolean;
  setOn: () => void;
  setOff: () => void;
  toggle: () => void;
};

export function CodeBlock({
  language,
  children,
  filepath,
}: {
  language: string;
  wrapLines: boolean;
  children: string | string[];
  filepath?: string;
}) {
  const { isMounted, setOn }: ToggleState = useBoolean(false);

  useEffect(setOn, [setOn]);
  const theme = useCodeTheme();
  const code = useMemo(() => trimCode(children), [children]);
  if (isMounted && language === "tsx") {
    return (
      <ReactLiveBlock
        filepath={filepath}
        language={language}
        code={code}
        theme={theme}
      />
    );
  }
  return null;
}
