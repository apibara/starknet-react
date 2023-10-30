import { InjectedConnector } from "./injected";

export function argent(): InjectedConnector {
  return new InjectedConnector({
    options: {
      id: "argentX",
      name: "Argent",
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
