import React, { useContext } from "react";

import { AccountInterface } from "starknet";

const AccountContext = React.createContext<AccountInterface | undefined>(
  undefined,
);

export function useStarknetAccount() {
  const account = useContext(AccountContext);
  return { account };
}

export function AccountProvider({
  account,
  children,
}: {
  account?: AccountInterface;
  children: React.ReactNode;
}) {
  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
}
