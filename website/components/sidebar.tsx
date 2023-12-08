"use client";
import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type NavItem = {
  title: string;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  label?: string;
  items?: NavItemWithChildren[];
};

export type NavItemWithChildren = NavItem & {
  items: NavItemWithChildren[];
};

export function Sidebar({ items }: { items: NavItemWithChildren[] }) {
  const pathname = usePathname();

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-4")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item?.items?.length && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
}

interface DocsSidebarNavItemsProps {
  items: NavItemWithChildren[];
  pathname: string | null;
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient && items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex flex-col items-start w-full rounded-lg border border-transparent px-2 py-1",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground",
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <span
              className={cn(
                "hover:underline",
                pathname === item.href ? "font-medium" : "",
              )}
            >
              {item.title}
            </span>
            {item.label && (
              <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
            {item.items && item.items.length > 0 && (
              <DocsSidebarNavItems items={item.items} pathname={pathname} />
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              "flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground opacity-60",
            )}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
            {item.items && item.items.length > 0 && (
              <DocsSidebarNavItems items={item.items} pathname={pathname} />
            )}
          </span>
        ),
      )}
    </div>
  ) : (
    <></>
  );
}
