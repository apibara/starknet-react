import { useAccount } from "@starknet-start/react";
import stringify from "safe-stable-stringify";
import { DemoContainer } from "../starknet";

export function Account() {
  return (
    <DemoContainer hasWallet>
      <AccountInner />
    </DemoContainer>
  );
}

function AccountInner() {
  const { address, connector, account } = useAccount();

  return (
    <div className="flex flex-col gap-4">
      <pre>
        {stringify(
          {
            address: address ?? "Connect wallet first",
            connector: connector?.id ?? "Connect wallet first",
            account: account ? typeof account : "Connect wallet first",
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
