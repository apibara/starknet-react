"use client";
import React, { useMemo, useState } from "react";

import { InjectedConnector, StarknetConfig } from "@starknet-react/core";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";

import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiReact } from "react-icons/si";

import { WalletBar } from "@/components/WalletBar";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/lib/hooks/useClipboard";

import { scope } from "./scope";
import { useLiveEditorStyle } from "./styles";

function EditableNotice() {
  return (
    <div className="absolute top-[40px] left-[35%] w-fill text-center text-sm mt-[5px] text-cat-overlay">
      This example is editable
    </div>
  );
}

export default function ReactLiveBlock({
  code,
  theme,
  filepath,
}: {
  language: string;
  code: string;
  // rome-ignore lint: fix types
  theme?: any;
  children?: React.ReactNode;
  filepath?: string;
}) {
  const [editorCode, setEditorCode] = useState(code);
  const onChange = (newCode: string) => setEditorCode(newCode.trim());
  const liveEditorStyle = useLiveEditorStyle();
  const connectors = useMemo(
    () =>
      shuffle([
        new InjectedConnector({ options: { id: "argentX" } }),
        new InjectedConnector({ options: { id: "braavos" } }),
      ]),
    [],
  );

  const { hasCopied, copyToClipboard } = useClipboard(code);

  return (
    <StarknetConfig connectors={connectors} autoConnect>
      <LiveProvider code={editorCode} scope={scope}>
        <div className="mt-[15px] mb-[30px] p-[20px] border-cat-peach border-2 rounded-md overflow-auto">
          <WalletBar />
          <LivePreview
            zIndex="1"
            __css={{
              button: {
                background: "transparent",
                rounded: "sm",
                borderColor: "#cdd6f4",
                borderWidth: 1,
                m: "3",
                p: "2",
              },
              span: { color: "#cdd6f4" },
              p: { color: "#cdd6f4", m: "3" },
            }}
          />
        </div>
        <div className="relative z-0">
          <div className="mt-[10px] rounded-md border-2 bg-cat-crust border-cat-surface">
            <div className="flex flex-row h-[40px] border-b-2 border-cat-surface justify-between items-center mb-[15px] ">
              <div className="items-center flex flex-row gap-[10px]">
                <SiReact className="ml-2" />
                {filepath && <p className="text-sm">{filepath}</p>}
              </div>
              <div className="flex flex-row gap-[10px]">
                <Button className="p-0" onClick={copyToClipboard}>
                  {hasCopied ? (
                    <IoMdCheckmark size={20} className="mr-4" />
                  ) : (
                    <MdOutlineContentCopy size={20} className="mr-4" />
                  )}
                </Button>
              </div>
            </div>

            <LiveEditor
              onChange={onChange}
              theme={theme}
              style={liveEditorStyle}
            />
          </div>
          <EditableNotice />
        </div>
        <LiveError
          style={{
            fontSize: "14",
            padding: "8px",
            borderRadius: "5px",
            color: "#1e1e2e",
            backgroundColor: "#eba0ac",
            overflowX: "auto",
            marginTop: "20px",
          }}
        />
      </LiveProvider>
    </StarknetConfig>
  );
}

const shuffle = <T extends unknown[]>(arr: T): T => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
