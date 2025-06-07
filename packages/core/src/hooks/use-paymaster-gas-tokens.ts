import type { Address } from "@starknet-react/chains";
import { useCallback, useEffect, useState } from "react";
import type { AccountInterface, TokenData } from "starknet";
import type { Connector } from "../connectors";
import { useStarknetAccount } from "../context/account";
import { useStarknet } from "../context/starknet";
import { getAddress } from "../utils";
import { useProvider } from "./use-provider";

/** Value returned from `usePaymasterGasTokens`. */
export type UsePaymasterGasTokensResult = {
  /** The paymaster gas tokens. */
  gasTokens: TokenData[];
};

/**
 * Hook for accessing the paymaster gas tokens.
 *
 * @remarks
 *
 * This hook is used to access the `AccountInterface` object provided by the
 * currently connected wallet.
 */
export function usePaymasterGasTokens(): UsePaymasterGasTokensResult {
  const { paymasterProvider } = useProvider();
  const [state, setState] = useState<UsePaymasterGasTokensResult>(
    {
      gasTokens: [],
    },
  );

  const refreshGasTokens = useCallback(async () => {
    if (paymasterProvider) {
      const supportedGasTokens = await paymasterProvider.getSupportedTokens();
      setState({ gasTokens: supportedGasTokens });
    }
  }, [paymasterProvider]);

  useEffect(() => {
    refreshGasTokens();
  }, [refreshGasTokens]);

  return state;
}
