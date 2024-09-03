import {
  type Address,
  useAccount,
  useNonceForAddress,
} from "@starknet-react/core";
import stringify from "safe-stable-stringify";
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

  const { data, isLoading, isError, error, isPending } = useNonceForAddress({
    address: account?.address as Address,
  });

  return (
    <div className="flex flex-col gap-4">
      <pre>
        {stringify(
          {
            data,
            isLoading,
            isPending,
            isError,
            error: error?.message,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
