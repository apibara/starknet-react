import { allDemos, allDocs, allHooks } from "@/.contentlayer/generated";

import type { NavItemWithChildren } from "@/components/sidebar";

const sortedDemos = allDemos.sort((a, b) => b.priority - a.priority);
const sortedHooks = allHooks.sort((a, b) => b.priority - a.priority);
const defaultHooks = sortedHooks.filter((hook) => hook.hookType == "default");
const queryHooks = sortedHooks.filter((hook) => hook.hookType == "query");
const mutationHooks = sortedHooks.filter((hook) => hook.hookType == "mutation");

export const demoSidebar: NavItemWithChildren[] = [
  {
    title: "Demos",
    items: sortedDemos.map(({ title, slugAsParams }) => ({
      title,
      href: `/demos/${slugAsParams}`,
      items: [],
    })),
  },
];

const sortedDocs = allDocs.sort((a, b) => b.priority - a.priority);

export const docsSidebar: NavItemWithChildren[] = [
  {
    title: "Overview",
    items: sortedDocs.map(({ title, slugAsParams }) => ({
      title,
      href: `/docs/${slugAsParams}`,
      items: [],
    })),
  },
  {
    title: "Hooks",
    items: [
      ...defaultHooks.map(({ title, slugAsParams }) => ({
        title,
        href: `/hooks/${slugAsParams}`,
        items: [],
      })),
      {
        title: "Query",
        href: "/hooks/query",
        items: queryHooks.map(({ title, slugAsParams }) => ({
          title,
          href: `/hooks/${slugAsParams}`,
          items: [],
        })),
      },
      {
        title: "Mutation",
        href: "/hooks/mutation",
        items: mutationHooks.map(({ title, slugAsParams }) => ({
          title,
          href: `/hooks/${slugAsParams}`,
          items: [],
        })),
      },
    ],
  },
];

export const mobileSidebar: NavItemWithChildren[] = [
  ...docsSidebar,
  ...demoSidebar,
];
