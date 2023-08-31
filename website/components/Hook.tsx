import {
  Function as TypedockFunction,
  TextLike,
  deprecationTag,
} from "../lib/typedoc";
import { DeprecationNotice } from "./DeprecationNotice";
import { Markdown } from "./Markdown";

function Content({
  content,
  hookName,
}: { content: TextLike[]; hookName?: string }) {
  const textContent = content.map((c) => c.text).join("");

  return (
    <Markdown filepath={`app/hooks/${hookName}/page.tsx`}>
      {textContent}
    </Markdown>
  );
}

function Summary({ hook }: { hook: TypedockFunction }) {
  const summary = hook?.signatures?.[0]?.comment?.summary ?? [];

  return <Content content={summary} />;
}

function Remarks({ hook }: { hook: TypedockFunction }) {
  const tags = hook?.signatures?.[0]?.comment?.blockTags;
  if (!tags) return <></>;
  const remarks = tags.find((t) => t.tag === "@remarks");

  if (!remarks) {
    return <></>;
  }

  return <Content content={remarks.content} />;
}

function Example({ hook }: { hook: TypedockFunction }) {
  const tags = hook?.signatures?.[0]?.comment?.blockTags;

  if (!tags) return <></>;
  const examples = tags.filter((t) => t.tag === "@example");

  return (
    <>
      {examples.map((example) => (
        <Content
          hookName={hook.name}
          content={example.content}
          key={hook.name}
        />
      ))}
    </>
  );
}

function Deprecation({ hook }: { hook: TypedockFunction }) {
  // convert to string, before that replace @link with link to page

  const tag = deprecationTag(hook);
  if (!tag) return <></>;
  const deprecation = tag.content
    .map((t) => {
      if (t.kind === "inline-tag") {
        return `[${t.text}](/hooks/${t.text})`;
      }
      return t.text;
    })
    .join("");

  if (!deprecation) return <></>;

  return <DeprecationNotice deprecation={deprecation} />;
}

export const Hook = {
  Summary,
  Remarks,
  Example,
  Deprecation,
};
