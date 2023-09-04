import {
  defineDocumentType,
  makeSource,
  ComputedFields,
} from "contentlayer/source-files";
import { remarkCodeHike } from "@code-hike/mdx";

import { codeHikeTheme } from "./code-hike-theme";

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: "docs/**/*.mdx",
  contentType: "mdx",
  computedFields,
  fields: {
    title: {
      required: true,
      type: "string",
    },
    priority: {
      required: true,
      type: "number",
    },
  },
}));

export const Demo = defineDocumentType(() => ({
  name: "Demo",
  filePathPattern: "demos/**/*.mdx",
  contentType: "mdx",
  computedFields,
  fields: {
    title: {
      required: true,
      type: "string",
    },
    priority: {
      required: true,
      type: "number",
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Doc, Demo],
  mdx: {
    remarkPlugins: [
      [
        remarkCodeHike,
        {
          theme: codeHikeTheme,
          showCopyButton: true,
          lineNumbers: true,
          staticMediaQuery: "not screen, (max-width: 768px)",
        },
      ],
    ],
  },
});
