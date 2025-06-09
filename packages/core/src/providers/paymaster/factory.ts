import type { Chain } from "@starknet-react/chains";
import type { PaymasterRpc } from "starknet";

export type ChainPaymasterFactory<T extends PaymasterRpc = PaymasterRpc> = (
  chain: Chain,
) => T | null;
