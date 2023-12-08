import React from "react";

import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";

export function DocContainer({
  sections,
  title,
  children,
}: {
  sections: string[];
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground w-fit">
          {sections?.map((section, i) => (
            <div key={i} className="flex flex-row items-center w-fit">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {section}
              </div>
              <ChevronRightIcon className="h-4 w-4" />
            </div>
          ))}
          <div className="font-medium text-foreground">{title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            {title}
          </h1>
        </div>
        <div className="pb-12 pt-8">{children}</div>
      </div>
    </main>
  );
}
