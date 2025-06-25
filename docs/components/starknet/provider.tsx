import { mainnet, sepolia } from "@starknet-react/chains";
import {
  type ExplorerFactory,
  StarknetConfig,
  ready,
  braavos,
  publicProvider,
  useInjectedConnectors,
} from "@starknet-react/core";

export function StarknetProvider({
  defaultChainId,
  children,
  explorer,
}: {
  children: React.ReactNode;
  defaultChainId?: bigint;
  explorer?: ExplorerFactory;
}) {
  const chains = [sepolia, mainnet];

  const provider = publicProvider();
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [ready(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "always",
    // Randomize the order of the connectors.
    order: "alphabetical",
    shimLegacyConnectors: ["okxwallet"],
  });

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      explorer={explorer}
      defaultChainId={defaultChainId}
    >
      {children}
    </StarknetConfig>
  );
}
