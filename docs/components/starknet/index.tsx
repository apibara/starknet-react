import { WalletBar } from "./bar";
import { StarknetProvider } from "./provider";

export function DemoContainer({
  hasWallet,
  children,
}: {
  hasWallet?: boolean;
  children: React.ReactNode;
}) {
  return (
    <StarknetProvider>
      <div className="flex flex-col border border-red-500 rounded shadow-md">
        {hasWallet ? <WalletBar /> : null}
        <div className="p-4">{children}</div>
      </div>
    </StarknetProvider>
  );
}
