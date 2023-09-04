import React from "react";

import "@code-hike/mdx/dist/index.css";
import "@/styles/globals.css";

import { ThemeProvider } from "components/theme-provider";
import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";
import { monoFont, sansFont } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Starknet React",
    template: "%s - Starknet React",
  },
  description: "A collection of React hooks for Starknet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        sansFont.variable,
        monoFont.variable,
      )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
