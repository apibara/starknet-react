import { constants } from "starknet";
import {
  ArgentMobileConnector,
  isInArgentMobileAppBrowser,
} from "starknetkit/argentMobile";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";

export const availableConnectors = isInArgentMobileAppBrowser()
  ? [
      ArgentMobileConnector.init({
        options: {
          url: typeof window !== "undefined" ? window.location.href : "",
          dappName: "Example dapp",
          chainId: constants.NetworkName.SN_SEPOLIA,
        },
      }),
    ]
  : [
      new InjectedConnector({ options: { id: "argentX" } }),
      new InjectedConnector({ options: { id: "braavos" } }),
      ArgentMobileConnector.init({
        options: {
          url: typeof window !== "undefined" ? window.location.href : "",
          dappName: "Example dapp",
          chainId: constants.NetworkName.SN_MAIN,
        },
      }),
      new WebWalletConnector({ url: "https://web.argent.xyz" }),
    ];
