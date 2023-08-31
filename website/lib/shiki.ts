import type { Highlighter, Lang, Theme } from "shiki";
import { getHighlighter, renderToHtml } from "shiki";

let highlighter: Highlighter;
export async function highlight(
  code: string,
  theme: Theme | undefined,
  lang: Lang,
) {
  highlighter = await getHighlighter({
    langs: [lang],
    theme: theme,
  });

  const tokens = highlighter.codeToThemedTokens(code, lang, theme, {
    includeExplanation: false,
  });
  const html = renderToHtml(tokens, { bg: "transparent" });

  return html;
}
