import type { Chain } from "../../types";
import type { PaymasterRpc } from "starknet";

export type ChainPaymasterFactory<T extends PaymasterRpc = PaymasterRpc> = (
  chain: Chain,
) => T | null;
