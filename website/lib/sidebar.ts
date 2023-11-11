import { allDemos, allDocs, allHooks } from "@/.contentlayer/generated";

import type { NavItemWithChildren } from "@/components/sidebar";

const sortedDemos = allDemos.sort((a, b) => b.priority - a.priority);
const sortedHooks = allHooks.sort((a, b) => b.title > a.title ? -1 : 1);

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
    items: sortedHooks.map(({ title, slugAsParams }) => ({
      title,
      href: `/hooks/${slugAsParams}`,
      items: [],
    })),
  }
];

export const mobileSidebar: NavItemWithChildren[] = [
  ...docsSidebar,
  ...demoSidebar,
];
