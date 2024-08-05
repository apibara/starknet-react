import { Address, useAccount, useNonceForAddress } from "@starknet-react/core";
import { DemoContainer } from "../starknet";

export function NonceForAddress() {
  return (
    <DemoContainer hasWallet>
      <NonceForAddressInner />
    </DemoContainer>
  );
}

function NonceForAddressInner() {
  const { account } = useAccount();

  const { data, isLoading, isError, error } = useNonceForAddress({
    address: account?.address as Address,
  });

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-lg">Nonce for Address</h1>
      <div className="flex flex-col mt-2">
        {account?.address ? (
          <>
            <div>nonce: {data} </div>
            <div>isLoading: {isLoading ? "true" : "false"} </div>
            <div>isError: {isError ? "true" : "false"} </div>
            <div>error: {error ? error.message : "null"} </div>
          </>
        ) : (
          "Connect your wallet to start."
        )}
      </div>
    </div>
  );
}
