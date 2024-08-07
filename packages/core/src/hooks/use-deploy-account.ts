import type {
  AccountInterface,
  BigNumberish,
  DeployContractResponse,
  InvocationsDetails,
  RawArgs,
} from "starknet";

import {
  type UseMutationProps,
  type UseMutationResult,
  useMutation,
} from "../query";

import { useAccount } from "./use-account";

export type DeployAccountVariables = {
  /** The class hash of the contract to deploy. */
  classHash?: string;
  /** The constructor arguments. */
  constructorCalldata?: RawArgs;
  /** Address salt. */
  addressSalt?: BigNumberish;
  /** Contract address. */
  contractAddress?: string;
  /** Transaction options. */
  options?: InvocationsDetails;
};

export type UseDeployAccountProps = DeployAccountVariables &
  UseMutationProps<DeployContractResponse, Error, DeployAccountVariables>;

type MutationResult = UseMutationResult<
  DeployContractResponse,
  Error,
  DeployAccountVariables
>;

export type UseDeployAccountResult = Omit<
  MutationResult,
  "mutate" | "mutateAsync"
> & {
  /** Deploy account. */
  deployAccount: MutationResult["mutate"];

  /** Deploy account. */
  deployAccountAsync: MutationResult["mutateAsync"];
};

/**
 * Hook for deploying a contract.
 *
 * @remarks
 *
 * This hook deploys a new contract from the currently connected account.
 */
export function useDeployAccount({
  classHash,
  constructorCalldata,
  addressSalt,
  contractAddress,
  options,
  ...props
}: UseDeployAccountProps): UseDeployAccountResult {
  const { account } = useAccount();
  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: mutationKey({
      account,
      classHash,
      constructorCalldata,
      addressSalt,
      contractAddress,
      options,
    }),
    mutationFn: mutationFn({
      account,
      classHash,
      constructorCalldata,
      addressSalt,
      contractAddress,
      options,
    }),
    ...props,
  });

  return {
    deployAccount: mutate,
    deployAccountAsync: mutateAsync,
    ...result,
  };
}

function mutationKey(
  props: { account?: AccountInterface } & Partial<DeployAccountVariables>,
) {
  return [{ entity: "deployAccount", ...props }] as const;
}

function mutationFn({
  account,
  classHash,
  constructorCalldata,
  addressSalt,
  contractAddress,
  options,
}: { account?: AccountInterface } & Partial<DeployAccountVariables>) {
  return async () => {
    if (!account) throw new Error("account is required");
    if (!classHash) throw new Error("classHash is required");
    return await account.deployAccount(
      { classHash, constructorCalldata, addressSalt, contractAddress },
      options,
    );
  };
}
