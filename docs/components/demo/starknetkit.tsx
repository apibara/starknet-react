import {
  type Connector,
  useAccount,
  useConnect,
  useContract,
  useNetwork,
  useSendTransaction,
} from "@starknet-react/core";
import { DemoContainer } from "../starknet";
import {
  type StarknetkitConnector,
  useStarknetkitConnectModal,
} from "starknetkit";
import type { Abi } from "starknet";

export function StarknetKit() {
  return (
    <DemoContainer>
      <StarknetKitInner />
    </DemoContainer>
  );
}

function StarknetKitInner() {
  const { connectAsync, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connectAsync({ connector: connector as Connector });
  };

  const { address } = useAccount();

  const { chain } = useNetwork();
  const { contract } = useContract({
    abi,
    address: chain.nativeCurrency.address,
  });

  const { isError, error, send } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("transfer", [address, 1n])]
        : undefined,
  });

  return (
    <div>
      {address ? (
        <>
          <p>
            <span className="font-bold"> Connected Account: </span> {address}
          </p>
          <div>
            <button onClick={() => send()} className="button">
              Send Transaction
            </button>
            {isError && <p>Error: {error?.message}</p>}
          </div>
        </>
      ) : (
        <button onClick={connectWallet} className="button">
          Connect Starknet Wallet (StarknetKit)
        </button>
      )}
    </div>
  );
}

const abi = [
  {
    type: "function",
    name: "transfer",
    state_mutability: "external",
    inputs: [
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
    ],
    outputs: [],
  },
] as const satisfies Abi;
