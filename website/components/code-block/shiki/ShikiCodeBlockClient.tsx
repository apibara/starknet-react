"use client";
import parse from "html-react-parser";

import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiGnubash, SiJavascript, SiTypescript } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { useClipboard } from "@/lib/hooks/useClipboard";

interface ShikiCodeBlockClientProps {
  html: string;
  languageText: string;
  code: string;
  filepath?: string;
}

export const ShikiCodeBlockClient = ({
  html,
  languageText,
  code,
  filepath,
}: ShikiCodeBlockClientProps) => {
  const htmlCode = parse(html);

  const { hasCopied, copyToClipboard } = useClipboard(code);

  const Icon: Record<string, React.ReactNode> = {
    JavaScript: <SiJavascript />,
    TypeScript: <SiTypescript />,
    Bash: <SiGnubash />,
  };

  return (
    <div className="bg-cat-crust border-2 rounded-lg border-cat-surface">
      <div className="flex flex-row h-10 border-b-2 border-b-cat-surface rounded-t-lg justify-between pr-4 items-center">
        <div className="flex flex-row gap-1 ml-2 items-center">
          {Icon[languageText] && Icon[languageText]}
          <div className="pl-4 text-sm">{filepath}</div>
        </div>
        <div className="flex items-center flex-row gap-8">
          {languageText && (
            <div className="text-cat-text text-sm ">{languageText}</div>
          )}
          <Button className="p-0" onClick={copyToClipboard}>
            {hasCopied ? (
              <IoMdCheckmark size={20} />
            ) : (
              <MdOutlineContentCopy size={20} />
            )}
          </Button>
        </div>
      </div>
      <div className="p-4 rounded-b-lg  bg-cat-mantle overflow-x-scroll">
        {htmlCode}
      </div>
    </div>
  );
};
