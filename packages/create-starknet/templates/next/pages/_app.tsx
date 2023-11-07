import type { AppProps } from "next/app";
import { devnet, goerli, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
} from "@starknet-react/core";
import "./globals.css"

export default function App({ Component, pageProps }: AppProps) {
  const chains = [goerli, mainnet, devnet];
  const providers = [publicProvider()];
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [
      argent(),
      braavos(),
    ],
    // Randomize the order of the connectors.
    order: "random"
  });

  return (
    <StarknetConfig autoConnect
      chains={chains}
      providers={providers}
      connectors={connectors}>
      <Component {...pageProps} />
    </StarknetConfig>
  );
}
