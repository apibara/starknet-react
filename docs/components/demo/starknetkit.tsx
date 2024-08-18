import {
  type Connector,
  publicProvider,
  StarknetConfig,
  useConnect,
} from "@starknet-react/core";
import {
  type StarknetkitConnector,
  useStarknetkitConnectModal,
} from "starknetkit";
import { availableConnectors } from "../starknetkit";
import { mainnet, sepolia } from "@starknet-react/chains";
import { useState } from "react";

export function StarknetKit() {
  return (
    <StarknetProvider>
      <StarknetKitInner />
    </StarknetProvider>
  );
}

/** This Demo is for experimental purpose only, will be removed later */
function StarknetKitInner() {
  const { connectAsync, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: availableConnectors as StarknetkitConnector[],
  });

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connectAsync({ connector: connector as Connector });
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        {connectors.map((connector, index) => (
          <WalletButton connector={connector} key={connector.id} />
        ))}

        <div className="my-5"> Starknetkit Modal</div>
        <button onClick={connectWallet} className="button">
          Starknetkit Modal
        </button>
      </div>
    </div>
  );
}

function WalletButton({ connector }: { connector: Connector }) {
  const [res, setRes] = useState<string>("-- No res --");
  const [res2, setRes2] = useState<string>("-- No res --");
  const [res3, setRes3] = useState<string>("-- No res --");

  const [time1, setTime1] = useState<number | undefined>(undefined);
  const [time2, setTime2] = useState<number | undefined>(undefined);

  async function connectWallet() {
    const _res = await connector.connect();
    setRes(JSON.stringify(_res.account));
  }

  async function request() {
    const start = performance.now();
    const _res = await connector.request({
      type: "wallet_getPermissions",
    });
    const end = performance.now();
    setTime1(end - start);
    setRes2(JSON.stringify(_res));
  }

  async function request2() {
    const start = performance.now();
    const _res = await connector.request({
      type: "wallet_requestAccounts",
      params: { silent_mode: true },
    });
    const end = performance.now();
    setTime2(end - start);
    setRes3(JSON.stringify(_res));
  }

  return (
    <div className="my-4 flex flex-col gap-2">
      <button onClick={() => connectWallet()} className="button">
        {connector.id} | connect()
        <br />
        {res}
      </button>
      <div className="flex gap-4">
        <button onClick={() => request()} className="button !bg-red-900">
          Request Call (wallet_getPermissions)
          <br />
          {res2}
          {time1 && <div>Time: {Math.floor(time1)} ms</div>}
        </button>
        <button onClick={() => request2()} className="button !bg-red-900">
          Request Call (wallet_requestAccounts with silent_mode)
          <br />
          {res3}
          {time2 && <div>Time: {Math.floor(time2)} ms</div>}
        </button>
      </div>
    </div>
  );
}

function StarknetProvider({ children }: { children: React.ReactNode }) {
  const chains = [sepolia, mainnet];
  const provider = publicProvider();

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={availableConnectors}
    >
      <div className="flex flex-col border border-red-500 rounded shadow-md">
        <div className="p-4">{children}</div>
      </div>
    </StarknetConfig>
  );
}
