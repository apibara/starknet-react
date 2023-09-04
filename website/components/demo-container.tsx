import React from "react";

export function DemoContainer({ children }: { children: React.ReactNode }) {
  return <div className="my-8 p-8 rounded-md bg-gradient">{children}</div>;
}
