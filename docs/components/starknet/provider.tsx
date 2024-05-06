import { mainnet, sepolia } from "@starknet-react/chains";
import {
  type ExplorerFactory,
  StarknetConfig,
  argent,
  braavos,
  publicProvider,
  useInjectedConnectors,
} from "@starknet-react/core";

export function StarknetProvider({
  children,
  explorer,
}: {
  children: React.ReactNode;
  explorer?: ExplorerFactory;
}) {
  const chains = [sepolia, mainnet];
  const provider = publicProvider();
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      explorer={explorer}
    >
      {children}
    </StarknetConfig>
  );
}
