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
      <div className="flex flex-col px-4 border border-primary rounded-xl">
        {hasWallet ? <WalletBar /> : null}
        <div className="py-4">{children}</div>
        {hasWallet ? (
          <i className="text-xs my-2">* Wallet connection required</i>
        ) : null}
      </div>
    </StarknetProvider>
  );
}
