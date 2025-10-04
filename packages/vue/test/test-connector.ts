import {
  Permission,
  type RequestFnCall,
  type RpcMessage,
  type RpcTypeToMessageMap,
} from "@starknet-io/types-js";
import { devnet } from "@starknet-react/chains";
import type {
  AccountInterface,
  PaymasterInterface,
  ProviderInterface,
} from "starknet";

import { Connector, type ConnectorData, type ConnectorIcons } from "../src/connectors/base";

const TEST_ACCOUNT_ADDRESS =
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

function createAccountStub(): AccountInterface {
  const stub = {
    address: TEST_ACCOUNT_ADDRESS,
    cairoVersion: "1",
    deploySelf: async () => stub,
    declare: async () => ({ transaction_hash: "0x1" }),
    execute: async () => ({ transaction_hash: "0x2" }),
    signMessage: async () => ["0x1"],
    signTransaction: async () => ["0x1"],
    signDeclareTransaction: async () => ["0x1"],
    signDeployAccountTransaction: async () => ["0x1"],
    signer: {
      getPubKey: async () => "0x1",
      signMessage: async () => ["0x1"],
      signTransaction: async () => ["0x1"],
      signDeclareTransaction: async () => ["0x1"],
      signDeployAccountTransaction: async () => ["0x1"],
    },
  } as Record<string, unknown>;

  return stub as AccountInterface;
}

export class TestConnector extends Connector {
  private connected = false;
  private readonly account = createAccountStub();
  private readonly chainId: bigint = devnet.id;

  override get id(): string {
    return "test";
  }

  override get name(): string {
    return "Test Connector";
  }

  override get icon(): ConnectorIcons {
    return ["", ""];
  }

  override available(): boolean {
    return true;
  }

  override async ready(): Promise<boolean> {
    return this.connected;
  }

  override async connect(): Promise<ConnectorData> {
    this.connected = true;
    const data: ConnectorData = {
      account: this.account.address,
      chainId: this.chainId,
    };
    this.emit("connect", data);
    return data;
  }

  override async disconnect(): Promise<void> {
    this.connected = false;
    this.emit("disconnect");
  }

  override async account(
    _provider: ProviderInterface,
    _paymasterProvider?: PaymasterInterface,
  ): Promise<AccountInterface> {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    return this.account;
  }

  override async chainId(): Promise<bigint> {
    return this.chainId;
  }

  override async request<T extends RpcMessage["type"]>(
    call: RequestFnCall<T>,
  ): Promise<RpcTypeToMessageMap[T]["result"]> {
    if (call.type === "wallet_requestAccounts") {
      return [this.account.address] as RpcTypeToMessageMap[T]["result"];
    }
    if (call.type === "wallet_requestChainId") {
      return this.chainId.toString() as RpcTypeToMessageMap[T]["result"];
    }
    if (call.type === "wallet_getPermissions") {
      return [Permission.ACCOUNTS] as RpcTypeToMessageMap[T]["result"];
    }
    return undefined as RpcTypeToMessageMap[T]["result"];
  }
}

export const TEST_ADDRESS = TEST_ACCOUNT_ADDRESS;
