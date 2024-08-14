import { useAccount } from "@starknet-react/core";
import { DemoContainer } from "../starknet";

export function Account() {
  return (
    <DemoContainer hasWallet>
      <AccountInner />
    </DemoContainer>
  );
}

function AccountInner() {
  const { address, connector } = useAccount();

  return (
    <div>
      {address ? (
        <>
          <p>
            <span className="font-bold"> Connected Account: </span> {address}
          </p>
          <p>
            <span className="font-bold"> Connected Connector: </span>{" "}
            {connector?.id}
          </p>
        </>
      ) : (
        <p>Connect Wallet first</p>
      )}
    </div>
  );
}
