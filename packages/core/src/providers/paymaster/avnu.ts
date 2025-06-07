import { PaymasterRpc } from "starknet";
import { paymasterRpcProvider } from "./paymasterrpc";
import { ChainPaymasterFactory } from "./factory";

/** Arguments for `avnuPaymasterProvider`. */
export type AvnuPaymasterProviderArgs = {
  /** Infura API key. */
  apiKey?: string;
};

/** Configure the Avnu paymaster provider using the provided API key. */
export function avnuPaymasterProvider({ apiKey }: AvnuPaymasterProviderArgs): ChainPaymasterFactory<PaymasterRpc> {
  return paymasterRpcProvider({
    rpc: (chain) => {
      const baseHttpUrl = chain.paymasterRpcUrls["default"].http[0];
      if (!baseHttpUrl) return null;
      return { nodeUrl: baseHttpUrl, headers: { "x-api-key": apiKey ?? "" } };
    },
  });
}
