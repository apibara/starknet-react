import type { Address } from "@starknet-react/chains";
import { useMemo } from "react";
import {
  CairoCustomEnum,
  Provider,
  type ProviderInterface,
  type RawArgsArray,
  cairo,
  hash,
  shortString,
  starknetId,
} from "starknet";

import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

import { type StarknetTypedContract, useContract } from "./use-contract";
import { useNetwork } from "./use-network";
import { useProvider } from "./use-provider";

/** Arguments for `useStarkProfile` hook. */
export type StarkProfileArgs = UseQueryProps<
  GetStarkprofileResponse,
  Error,
  GetStarkprofileResponse,
  ReturnType<typeof queryKey>
> & {
  /** Account address. */
  address?: Address;
  /** Get Starknet ID default pfp url if no profile picture is set */
  useDefaultPfp?: boolean;
  /** Naming contract to use. */
  namingContract?: Address;
  /** Identity contract to use. */
  identityContract?: Address;
};

/** Value returned by `useStarkProfile` hook. */
export type GetStarkprofileResponse = {
  name: string;
  /** Metadata url of the NFT set as profile picture. */
  profile?: string;
  /** Profile picture url. */
  profilePicture?: string;
  twitter?: string;
  github?: string;
  discord?: string;
  proofOfPersonhood: boolean;
};

export type UseStarkProfileResult = UseQueryResult<
  GetStarkprofileResponse,
  Error
>;

type Contract = StarknetTypedContract<typeof multicallABI>;

/**
 * Hook for fetching Stark profile for address.
 *
 * @remarks
 *
 * This hook fetches the stark name of the specified address, profile picture url,
 * social networks ids, and proof of personhood a user has set on its starknetid.
 * It defaults to the starknet.id naming and identity contracts but different contracts can be
 * targetted by specifying their contract addresses
 * If address does not have a stark name, it will return "stark"
 *
 */
export function useStarkProfile({
  address,
  useDefaultPfp = true,
  namingContract,
  identityContract,
  enabled: enabled_ = true,

  ...props
}: StarkProfileArgs): UseStarkProfileResult {
  const { provider } = useProvider();
  const { chain } = useNetwork();
  if (!StarknetIdcontracts[chain.network])
    throw new Error("Network not supported");
  const { contract: multicallContract } = useContract({
    abi: multicallABI,
    address: StarknetIdcontracts[chain.network]["multicall"],
  });

  const enabled = useMemo(
    () => Boolean(enabled_ && address),
    [enabled_, address],
  );

  const { refetchInterval, ...rest } = props;

  return useQuery({
    queryKey: queryKey({
      address,
      namingContract,
      identityContract,
      network: chain.network,
      useDefaultPfp,
    }),
    queryFn: queryFn({
      address,
      useDefaultPfp,
      namingContract,
      provider,
      network: chain.network,
      identityContract,
      multicallContract,
    }),
    enabled,
    refetchInterval,
    ...rest,
  });
}

function queryKey({
  address,
  namingContract,
  identityContract,
  network,
  useDefaultPfp,
}: {
  address?: string;
  namingContract?: string;
  identityContract?: string;
  network?: string;
  useDefaultPfp?: boolean;
}) {
  return [
    {
      entity: "starkprofile",
      address,
      namingContract,
      identityContract,
      network,
      useDefaultPfp,
    },
  ] as const;
}

function queryFn({
  address,
  useDefaultPfp,
  namingContract,
  identityContract,
  provider,
  network,
  multicallContract,
}: StarkProfileArgs & {
  provider: ProviderInterface;
  multicallContract?: Contract;
  network?: string;
}) {
  return async () => {
    throw new Error("Not implemented");
    /*
    if (!address) throw new Error("address is required");
    if (!multicallContract) throw new Error("multicallContract is required");
    if (!network) throw new Error("network is required");

    const contracts = StarknetIdcontracts[network];
    const identity = identityContract ?? contracts["identity"];
    const naming = namingContract ?? contracts["naming"];

    // get decoded starkname
    const p = new Provider(provider);
    const name = await p.getStarkName(address, naming);

    const data = await multicallContract.call("aggregate", [
      [
        {
          execution: staticExecution(),
          to: hardcoded(naming),
          selector: hardcoded(hash.getSelectorFromName("address_to_domain")),
          calldata: [hardcoded(address)],
        },
        {
          execution: staticExecution(),
          to: hardcoded(naming),
          selector:
            network === "mainnet"
              ? hardcoded(hash.getSelectorFromName("domain_to_token_id"))
              : hardcoded(hash.getSelectorFromName("domain_to_id")),
          calldata: [arrayReference(0, 0)],
        },
        {
          execution: staticExecution(),
          to: hardcoded(identity),
          selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
          calldata: [
            reference(1, 0),
            hardcoded(shortString.encodeShortString("twitter")),
            hardcoded(contracts["verifier"] as string),
            hardcoded("0"),
          ],
        },
        {
          execution: staticExecution(),
          to: hardcoded(identity),
          selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
          calldata: [
            reference(1, 0),
            hardcoded(shortString.encodeShortString("github")),
            hardcoded(contracts["verifier"] as string),
            hardcoded("0"),
          ],
        },
        {
          execution: staticExecution(),
          to: hardcoded(identity),
          selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
          calldata: [
            reference(1, 0),
            hardcoded(shortString.encodeShortString("discord")),
            hardcoded(contracts["verifier"] as string),
            hardcoded("0"),
          ],
        },
        {
          execution: staticExecution(),
          to: hardcoded(identity),
          selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
          calldata: [
            reference(1, 0),
            hardcoded(shortString.encodeShortString("proof_of_personhood")),
            hardcoded(contracts["verifier_pop"] as string),
            hardcoded("0"),
          ],
        },
        // PFP
        {
          execution: staticExecution(),
          to: hardcoded(identity),
          selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
          calldata: [
            reference(1, 0),
            hardcoded(shortString.encodeShortString("nft_pp_contract")),
            hardcoded(contracts["verifier_pfp"] as string),
            hardcoded("0"),
          ],
        },
        {
          execution: staticExecution(),
          to: hardcoded(identity),
          selector: hardcoded(
            hash.getSelectorFromName("get_extended_verifier_data"),
          ),
          calldata: [
            reference(1, 0),
            hardcoded(shortString.encodeShortString("nft_pp_id")),
            hardcoded("2"),
            hardcoded(contracts["verifier_pfp"] as string),
            hardcoded("0"),
          ],
        },
        {
          execution: notEqual(6, 0, 0),
          to: reference(6, 0),
          selector: hardcoded(hash.getSelectorFromName("tokenURI")),
          calldata: [reference(7, 1), reference(7, 2)],
        },
      ],
    ]);

    if (Array.isArray(data)) {
      const name =
        data[0][0] !== BigInt(0)
          ? starknetId.useDecoded(data[0].slice(1))
          : undefined;
      const twitter =
        data[2][0] !== BigInt(0) ? data[2][0].toString() : undefined;
      const github =
        data[3][0] !== BigInt(0) ? data[3][0].toString() : undefined;
      const discord =
        data[4][0] !== BigInt(0) ? data[4][0].toString() : undefined;
      const proofOfPersonhood = data[5][0] === BigInt(1);

      const profile =
        data.length === 9
          ? data[8]
              .slice(1)
              .map((val) => shortString.decodeShortString(val.toString()))
              .join("")
          : undefined;

      // extract nft_image from profile data
      const profilePicture = profile
        ? profile.includes("base64")
          ? JSON.parse(atob(profile.split(",")[1].slice(0, -1))).image
          : await fetchImageUrl(profile)
        : useDefaultPfp
          ? `https://starknet.id/api/identicons/${data[1][0].toString()}`
          : undefined;

      const res: GetStarkprofileResponse = {
        name,
        twitter,
        github,
        discord,
        proofOfPersonhood,
        profilePicture,
        profile,
      };

      return res;
    }

    throw new Error("Error while fetching data");
    */
  };
}

/*
const hardcoded = (arg: string | number) => {
  return new CairoCustomEnum({
    Hardcoded: arg,
  });
};

const reference = (call: number, pos: number) => {
  return new CairoCustomEnum({
    Reference: cairo.tuple(call, pos),
  });
};

const arrayReference = (call: number, pos: number) => {
  return new CairoCustomEnum({
    ArrayReference: cairo.tuple(call, pos),
  });
};

const staticExecution = () => {
  return new CairoCustomEnum({
    Static: {},
  });
};

const notEqual = (call: number, pos: number, value: number) => {
  return new CairoCustomEnum({
    IfNotEqual: cairo.tuple(call, pos, value),
  });
};

const fetchImageUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(parseImageUrl(url));

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Check if the "image" key exists and is not null
    if (data.image) {
      return data.image;
    }

    return "Image is not set";
  } catch (error) {
    console.error("There was a problem fetching the image URL:", error);
    return "Error fetching data";
  }
};
*/

type StarknetIdContractTypes = {
  [network: string]: {
    naming: Address;
    identity: Address;
    verifier: Address;
    verifier_pop: Address;
    verifier_pfp: Address;
    multicall: Address;
  };
};

const StarknetIdcontracts: StarknetIdContractTypes = {
  sepolia: {
    naming: "0x154bc2e1af9260b9e66af0e9c46fc757ff893b3ff6a85718a810baf1474",
    identity: "0x3697660a0981d734780731949ecb2b4a38d6a58fc41629ed611e8defda",
    verifier:
      "0x60B94fEDe525f815AE5E8377A463e121C787cCCf3a36358Aa9B18c12c4D566",
    verifier_pop:
      "0x15ae88ae054caa74090b89025c1595683f12edf7a4ed2ad0274de3e1d4a",
    verifier_pfp:
      "0x9e7bdb8dabd02ea8cfc23b1d1c5278e46490f193f87516ed5ff2dfec02",
    multicall:
      "0x07a9013697371ce40d0306b4c810c6a4db9bfda119dd9ae1e8701c8e288d734b",
  },
  mainnet: {
    naming: "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678",
    identity:
      "0x05dbdedc203e92749e2e746e2d40a768d966bd243df04a6b712e222bc040a9af",
    verifier:
      "0x07d14dfd8ee95b41fce179170d88ba1f0d5a512e13aeb232f19cfeec0a88f8bf",
    verifier_pop:
      "0x0293eb2ba9862f762bd3036586d5755a782bd22e6f5028320f1d0405fd47bff4",
    verifier_pfp:
      "0x070aaa20ec4a46da57c932d9fd89ca5e6bb9ca3188d3df361a32306aff7d59c7",
    multicall:
      "0x034ffb8f4452df7a613a0210824d6414dbadcddce6c6e19bf4ddc9e22ce5f970",
  },
} as const;

/*
const executeMulticallWithFallback = async (
  contract: ContractInterface,
  functionName: string,
  initialCalldata: RawArgsArray,
  fallbackCalldata: RawArgsArray,
) => {
  try {
    // Attempt the initial call with the new hint parameter
    return await contract.call(functionName, [initialCalldata]);
  } catch (initialError) {
    // If the initial call fails, try with the fallback calldata without the hint parameter
    return await contract.call(functionName, [fallbackCalldata]);
  }
};

const getStarkProfileCalldata = (
  address: string,
  namingContract: string,
  identityContract: string,
  contracts: Record<string, string>,
): {
  initialCalldata: RawArgsArray;
  fallbackCalldata: RawArgsArray;
} => {
  const initialCalldata: RawArgsArray = [];
  const fallbackCalldata: RawArgsArray = [];

  initialCalldata.push({
    execution: staticExecution(),
    to: hardcoded(namingContract),
    selector: hardcoded(hash.getSelectorFromName("address_to_domain")),
    calldata: [hardcoded(address), hardcoded("0")],
  });
  fallbackCalldata.push({
    execution: staticExecution(),
    to: hardcoded(namingContract),
    selector: hardcoded(hash.getSelectorFromName("address_to_domain")),
    calldata: [hardcoded(address)],
  });

  const calls = [
    {
      execution: staticExecution(),
      to: hardcoded(namingContract),
      selector: hardcoded(hash.getSelectorFromName("domain_to_id")),
      calldata: [arrayReference(0, 0)],
    },
    {
      execution: staticExecution(),
      to: hardcoded(identityContract),
      selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
      calldata: [
        reference(1, 0),
        hardcoded(shortString.encodeShortString("twitter")),
        hardcoded(contracts["verifier"] as string),
        hardcoded("0"),
      ],
    },
    {
      execution: staticExecution(),
      to: hardcoded(identityContract),
      selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
      calldata: [
        reference(1, 0),
        hardcoded(shortString.encodeShortString("github")),
        hardcoded(contracts["verifier"] as string),
        hardcoded("0"),
      ],
    },
    {
      execution: staticExecution(),
      to: hardcoded(identityContract),
      selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
      calldata: [
        reference(1, 0),
        hardcoded(shortString.encodeShortString("discord")),
        hardcoded(contracts["verifier"] as string),
        hardcoded("0"),
      ],
    },
    {
      execution: staticExecution(),
      to: hardcoded(identityContract),
      selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
      calldata: [
        reference(1, 0),
        hardcoded(shortString.encodeShortString("proof_of_personhood")),
        hardcoded(contracts["verifier_pop"] as string),
        hardcoded("0"),
      ],
    },
    // PFP
    {
      execution: staticExecution(),
      to: hardcoded(identityContract),
      selector: hardcoded(hash.getSelectorFromName("get_verifier_data")),
      calldata: [
        reference(1, 0),
        hardcoded(shortString.encodeShortString("nft_pp_contract")),
        hardcoded(contracts["verifier_pfp"] as string),
        hardcoded("0"),
      ],
    },
    {
      execution: staticExecution(),
      to: hardcoded(identityContract),
      selector: hardcoded(
        hash.getSelectorFromName("get_extended_verifier_data"),
      ),
      calldata: [
        reference(1, 0),
        hardcoded(shortString.encodeShortString("nft_pp_id")),
        hardcoded("2"),
        hardcoded(contracts["verifier_pfp"] as string),
        hardcoded("0"),
      ],
    },
    {
      execution: notEqual(6, 0, 0),
      to: reference(6, 0),
      selector: hardcoded(hash.getSelectorFromName("tokenURI")),
      calldata: [reference(7, 1), reference(7, 2)],
    },
  ];
  initialCalldata.push(...calls);
  fallbackCalldata.push(...calls);

  return { initialCalldata, fallbackCalldata };
};

*/

const multicallABI = [
  {
    name: "ComposableMulticallImpl",
    type: "impl",
    interface_name: "composable_multicall::IComposableMulticall",
  },
  {
    name: "composable_multicall::Execution",
    type: "enum",
    variants: [
      {
        name: "Static",
        type: "()",
      },
      {
        name: "IfEqual",
        type: "(core::integer::u32, core::integer::u32, core::felt252)",
      },
      {
        name: "IfNotEqual",
        type: "(core::integer::u32, core::integer::u32, core::felt252)",
      },
    ],
  },
  {
    name: "composable_multicall::DynamicFelt",
    type: "enum",
    variants: [
      {
        name: "Hardcoded",
        type: "core::felt252",
      },
      {
        name: "Reference",
        type: "(core::integer::u32, core::integer::u32)",
      },
    ],
  },
  {
    name: "composable_multicall::DynamicCalldata",
    type: "enum",
    variants: [
      {
        name: "Hardcoded",
        type: "core::felt252",
      },
      {
        name: "Reference",
        type: "(core::integer::u32, core::integer::u32)",
      },
      {
        name: "ArrayReference",
        type: "(core::integer::u32, core::integer::u32)",
      },
    ],
  },
  {
    name: "composable_multicall::DynamicCall",
    type: "struct",
    members: [
      {
        name: "execution",
        type: "composable_multicall::Execution",
      },
      {
        name: "to",
        type: "composable_multicall::DynamicFelt",
      },
      {
        name: "selector",
        type: "composable_multicall::DynamicFelt",
      },
      {
        name: "calldata",
        type: "core::array::Array::<composable_multicall::DynamicCalldata>",
      },
    ],
  },
  {
    name: "core::array::Span::<core::felt252>",
    type: "struct",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<core::felt252>",
      },
    ],
  },
  {
    name: "composable_multicall::IComposableMulticall",
    type: "interface",
    items: [
      {
        name: "aggregate",
        type: "function",
        inputs: [
          {
            name: "calls",
            type: "core::array::Array::<composable_multicall::DynamicCall>",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<core::array::Span::<core::felt252>>",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    kind: "enum",
    name: "composable_multicall::contract::ComposableMulticall::Event",
    type: "event",
    variants: [],
  },
] as const;
