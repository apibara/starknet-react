import React from "react";
import { Button } from "./Button";

export default function Dialog({
  children,
  title,
}: { children: React.ReactNode; title: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>{title}</Button>
      {isOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/30">
          <div className="p-8 bg-white rounded-md flex flex-col gap-12">
            <div className="flex flex-row justify-between w-full">
              <h1 className="font-semibold text-xl">{title}</h1>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                x
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
