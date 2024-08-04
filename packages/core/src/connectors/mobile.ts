import { Connector } from "~/connectors/base";
import { braavos } from "~/connectors/helpers";

export const isMobile = (): boolean => {
  const userAgent =
    typeof window !== "undefined" ? window.navigator?.userAgent : "";
  return /Android|iPhone|iPad|iPod/i.test(userAgent);
};

export const withMobileConnector = (connectors: Connector[]): Connector[] => {
  if (
    isMobile() &&
    // In the context of a mobile browser, `starknet_braavos` is only injected
    // if the dApp is launched within the Braavos in-app dApp browser
    !!window.starknet_braavos
  ) {
    return [braavos()];
  }

  return connectors;
};
