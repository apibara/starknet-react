import { type Sidebar } from "vocs";

export const sidebar = {
  "/docs/": [
    {
      text: "Introduction",
      items: [
        { text: "Getting Started", link: "/docs/getting-started" },
        { text: "Upgrading to V3", link: "/docs/upgrading-to-v3" },
      ]
    },
    {
      text: "Hooks",
      items: [
        { text: "useAccount", link: "/docs/hooks/use-account" }
      ],
    }
  ],
} as const satisfies Sidebar;
