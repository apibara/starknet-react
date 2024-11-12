import { InjectedConnector } from "./injected";
import { LegacyInjectedConnector } from "./legacy";

export function argent(): InjectedConnector {
  return new InjectedConnector({
    options: {
      id: "argentX",
      name: "Argent X",
    },
  });
}

export function braavos(): InjectedConnector {
  return new InjectedConnector({
    options: {
      id: "braavos",
      name: "Braavos",
    },
  });
}

export function injected({ id }: { id: string }): InjectedConnector {
  return new InjectedConnector({
    options: {
      id,
    },
  });
}

export function legacyInjected({
  id,
}: { id: string }): LegacyInjectedConnector {
  return new LegacyInjectedConnector({
    options: {
      id,
    },
  });
}
