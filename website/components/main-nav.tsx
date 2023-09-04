"use client";
import React from "react";

import { Mountain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Mountain className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Starknet React</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/docs"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/docs")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Documentation
        </Link>
        <Link
          href="/hooks"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/hooks")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Hooks
        </Link>
        <Link
          href="/demos"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/demos")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Demos
        </Link>
      </nav>
    </div>
  );
}
