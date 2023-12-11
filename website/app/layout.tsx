import React from "react";

import "@code-hike/mdx/dist/index.css";
import "@/styles/globals.css";

import { ThemeProvider } from "components/theme-provider";
import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";
import { monoFont, sansFont } from "@/lib/fonts";
import { JotaiProvider } from "@/components/jotai-provider";
import { Notice } from "@/components/notice";

export const metadata: Metadata = {
  title: {
    default: "Starknet React",
    template: "%s - Starknet React",
  },
  description: "A collection of React hooks for Starknet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          sansFont.variable,
          monoFont.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JotaiProvider>
            <div className="relative flex min-h-screen flex-col">
              <Notice>
                <p>
                  Starknet testnet is migrating to Sepolia.{" "}
                  <a
                    href="https://medium.com/@Jonathanstarknet/next-version-of-starknet-v0-12-3-v0-13-0-and-migration-to-sepolia-testnet-88efd3a68d1c"
                    target="_blank"
                    className="underline"
                  >
                    Read more
                  </a>
                  .
                </p>
              </Notice>
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
