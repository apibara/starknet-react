import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CreateStateArgs, createState, type State } from "./state";

export const StarknetContext = createContext<State | undefined>(undefined);

export type StarknetConfigProps = {
  children: React.ReactNode;
  queryClient?: QueryClient;
} & CreateStateArgs;

export function StarknetConfig({
  children,
  queryClient,
  ...props
}: StarknetConfigProps) {
  const state = createState(props);

  return (
    <QueryClientProvider client={queryClient ?? new QueryClient()}>
      <StarknetContext.Provider value={state}>
        {children}
      </StarknetContext.Provider>
    </QueryClientProvider>
  );
}

/**
 * @internal
 * Access the Starknet state.
 */
export function useStarknet() {
  const state = useContext(StarknetContext);
  if (!state) {
    throw new Error("useStarknet must be used within StarknetConfig");
  }
  return state;
}
