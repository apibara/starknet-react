import React from "react";
import ReactMarkdown from "react-markdown";
import { Lang, Theme } from "shiki";

import { trimCode } from "@/lib/helpers/trimCode";

import { CodeBlock } from "./code-block";
import { ShikiCodeBlock } from "./code-block/shiki/ShikiCodeBlock";

export function Markdown({
  children,
  shiki,
  theme,
  filepath,
}: {
  children: string;
  shiki?: boolean;
  theme?: Theme;
  filepath?: string;
}) {
  const MarkdownComponents: object = {
    // @ts-ignore
    code({ node, className, inline: _inline, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const hasMeta = node?.data?.meta;
      const code = trimCode(children);
      return match ? (
        shiki ? (
          /* @ts-expect-error Server Component */
          <ShikiCodeBlock
            filepath={filepath}
            theme={theme}
            language={match[1] as Lang}
            code={code}
          />
        ) : (
          <CodeBlock
            filepath={filepath}
            language={match[1] ?? ""}
            wrapLines={hasMeta ? true : false}
          >
            {children}
          </CodeBlock>
        )
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown components={MarkdownComponents}>{children}</ReactMarkdown>
  );
}
