import { allDemos, allDocs } from "@/.contentlayer/generated";

import type { NavItemWithChildren } from "@/components/sidebar";

const sortedDemos = allDemos.sort((a, b) => b.priority - a.priority);

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
];
