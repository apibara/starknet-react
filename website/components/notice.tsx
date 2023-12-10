import React from "react";

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-primary py-2 text-sm">
      <div className="container">{children}</div>
    </div>
  );
}
