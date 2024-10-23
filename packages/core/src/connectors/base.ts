import type {
  RequestFnCall,
  RpcMessage,
  RpcTypeToMessageMap,
  StarknetWindowObject,
} from "@starknet-io/types-js";
import EventEmitter from "eventemitter3";
import type {
  AccountInterface,
  ProviderInterface,
  ProviderOptions,
} from "starknet";

/** Connector icons, as base64 encoded svg. */
export type ConnectorIcons = StarknetWindowObject["icon"];

/** Connector data. */
export type ConnectorData = {
  /** Connector account. */
  account?: string;
  /** Connector network. */
  chainId?: bigint;
};

/** Connector events. */
export interface ConnectorEvents {
  /** Emitted when account or network changes. */
  change(data: ConnectorData): void;
  /** Emitted when connection is established. */
  connect(data: ConnectorData): void;
  /** Emitted when connection is lost. */
  disconnect(): void;
}

export type ConnectArgs = {
  chainIdHint?: bigint;
};

export abstract class Connector extends EventEmitter<ConnectorEvents> {
  /** Unique connector id. */
  abstract get id(): string;
  /** Connector name. */
  abstract get name(): string;
  /** Connector icons. */
  abstract get icon(): ConnectorIcons;

  /** Whether connector is available for use */
  abstract available(): boolean;
  /** Whether connector is already authorized */
  abstract ready(): Promise<boolean>;
  /** Connect wallet. */
  abstract connect(args: ConnectArgs): Promise<ConnectorData>;
  /** Disconnect wallet. */
  abstract disconnect(): Promise<void>;
  /** Get current account. */
  abstract account(
    provider: ProviderOptions | ProviderInterface,
  ): Promise<AccountInterface>;
  /** Get current chain id. */
  abstract chainId(): Promise<bigint>;
  /** Create request call to wallet */
  abstract request<T extends RpcMessage["type"]>(
    call: RequestFnCall<T>,
  ): Promise<RpcTypeToMessageMap[T]["result"]>;
}
