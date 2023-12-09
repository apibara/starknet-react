"use client";
import React from "react";

import { useMDXComponent } from "next-contentlayer/hooks";
import { Info } from "lucide-react";

import { AccountsDemo } from "@/components/demos/accounts";
import { ConnectWalletDemo } from "@/components/demos/connect-wallet";
import { SendTransactionDemo } from "@/components/demos/send-transaction";
import { ExplorersDemo } from "@/components/demos/explorers";
import { SignMessageDemo } from "@/components/demos/sign-message";
import { TokenBalanceDemo } from "@/components/demos/balance";
import { StarknetIDDemo } from "@/components/demos/starknetid";
import { TransactionManagerDemo } from "@/components/demos/transaction-manager";
import { DemoContainer } from "@/components/demo-container";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const components = {
  AccountsDemo,
  ConnectWalletDemo,
  SendTransactionDemo,
  SignMessageDemo,
  ExplorersDemo,
  StarknetIDDemo,
  TokenBalanceDemo,
  TransactionManagerDemo,
  DemoContainer,

  Alert,
  AlertTitle,
  AlertDescription,
  Info,

  // Typography
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn("font-heading mt-2 text-4xl font-bold", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "font-heading mt-12 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "font-heading mt-8 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "font-heading mt-8 text-lg font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
};

type MdxProps = {
  code: string;
};

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="mdx">
      <Component components={components} />
    </div>
  );
}
