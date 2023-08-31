import React from "react";

export function useLiveEditorStyle(): React.CSSProperties {
  return {
    fontFamily: `'Iosevka', monospace`,
    fontSize: "14",
  };
}

// rome-ignore lint: fix types
export function useCodeTheme(): any {
  return {
    plain: {
      color: "cat.text",
      backgroundColor: "cat.mantle",
    },
    styles: [
      {
        types: ["variable"],
        style: {
          color: "rgb(242, 205, 205)",
        },
      },
      {
        types: ["function"],
        style: {
          color: "rgb(137, 180, 250)",
        },
      },
      {
        types: ["builtin"],
        style: {
          color: "rgb(205, 214, 244)",
        },
      },
      {
        types: ["number", "constant", "changed", "namespace", "class-name"],
        style: {
          color: "rgb(250, 179, 135)",
        },
      },
      {
        types: ["keyword", "selector"],
        style: {
          color: "rgb(243, 139, 168)",
        },
      },
      {
        types: ["punctuation"],
        style: {
          color: "rgb(127, 132, 156)",
        },
      },
      {
        types: ["operator", "symbol"],
        style: {
          color: "rgb(137, 220, 235)",
        },
      },
      {
        types: ["inserted"],
        style: {
          color: "rgb(166, 227, 161)",
        },
      },
      {
        types: ["deleted"],
        style: {
          color: "rgb(148, 226, 213)",
        },
      },
      {
        types: ["string"],
        style: {
          color: "rgb(166, 227, 161)",
        },
      },
      {
        types: ["char"],
        style: {
          color: "rgb(249, 226, 175)",
        },
      },
      {
        types: ["tag"],
        style: {
          color: "rgb(203, 166, 247)",
        },
      },
      {
        types: ["attr-name"],
        style: {
          color: "rgb(137, 180, 250)",
        },
      },
      {
        types: ["comment"],
        style: {
          color: "cat.overlay",
        },
      },
    ],
  };
}
