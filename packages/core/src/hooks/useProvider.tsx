import { ProviderInterface } from "starknet";
import { useStarknet } from "~/context";

export type UseProviderProps<ChainId extends bigint | undefined = undefined> = {
  /** Override the provider chainId. */
  chainId?: ChainId extends undefined ? undefined : ChainId;
};

/** Value returned from `useProvider`. */
export type UseProviderResult<ChainId extends bigint | undefined = undefined> =
  {
    /** The current provider. */
    provider: ChainId extends undefined
      ? ProviderInterface
      : ProviderInterface | undefined;
  };

/**
 * Access the current RPC provider.
 *
 * @remarks
 *
 * Use this hook to access the current provider object
 * implementing starknet.js `ProviderInterface`.
 *
 * @param props.chainId - Override the provider chainId.
 */
export function useProvider<ChainId extends bigint | undefined = undefined>(
  props: UseProviderProps<ChainId> = {},
): UseProviderResult<ChainId> {
  const state = useStarknet();
  let provider: ProviderInterface | undefined;
  try {
    provider = state.getProvider(props);
  } catch {}
  return { provider } as UseProviderResult<ChainId>;
}
