import { type Sidebar } from "vocs";

export const sidebar = {
  "/docs/": [
    {
      text: "Introduction",
      items: [
        { text: "Getting Started", link: "/docs/getting-started" },
        { text: "Upgrading to V3", link: "/docs/upgrading-to-v3" },
      ],
    },
    {
      text: "Hooks",
      items: [
        { text: "useAccount", link: "/docs/hooks/use-account" },
        { text: "useAddChain", link: "/docs/hooks/use-add-chain" },
        { text: "useBalance", link: "/docs/hooks/use-balance" },
        { text: "useBlock", link: "/docs/hooks/use-block" },
        { text: "useBlockNumber", link: "/docs/hooks/use-block-number" },
        { text: "useCall", link: "/docs/hooks/use-call" },
        { text: "useConnect", link: "/docs/hooks/use-connect" },
        { text: "useContract", link: "/docs/hooks/use-contract" },
        {
          text: "useContractFactory",
          link: "/docs/hooks/use-contract-factory",
        },
        {
          text: "useDeclareContract",
          link: "/docs/hooks/use-declare-contract",
        },
        { text: "useReadContract", link: "/docs/hooks/use-read-contract" },
      ],
    },
  ],
} as const satisfies Sidebar;
