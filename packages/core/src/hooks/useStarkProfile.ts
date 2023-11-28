import { useMemo } from "react";
import {
  CairoCustomEnum,
  ContractInterface,
  Provider,
  ProviderInterface,
  cairo,
  hash,
  shortString,
} from "starknet";

import { UseQueryProps, UseQueryResult, useQuery } from "~/query";
import { useProvider } from "./useProvider";
import { useContract } from "./useContract";
import { useNetwork } from "./useNetwork";

/** Arguments for `useStarkProfile` hook. */
export type StarkProfileArgs = UseQueryProps<
  GetStarkprofileResponse,
  unknown,
  GetStarkprofileResponse,
  ReturnType<typeof queryKey>
> & {
  /** Account address. */
  address?: string;
  /** Get Starknet ID default pfp url if no profile picture is set */
  useDefaultPfp?: boolean;
  /** Naming contract to use. */
  namingContract?: string;
  /** Identity contract to use. */
  identityContract?: string;
};

/** Value returned by `useStarkProfile` hook. */
type GetStarkprofileResponse = {
  name?: string;
  /** Metadata url of the NFT set as profile picture. */
  profile?: string;
  /** Profile picture url. */
  profilePicture?: string;
  twitter?: string;
  github?: string;
  discord?: string;
  proofOfPersonhood?: boolean;
};
export type useStarkProfileResult = UseQueryResult<
  GetStarkprofileResponse,
  unknown
>;

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
 * @example
 * This example shows how to get the stark profile of an address using the default
 * Starknet.id contracts
 * ```tsx
 * function Component() {
 *   const address = '0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3'
 *   const { data, isLoading, isError } = useStarkProfile({ address })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error fetching stark profile...</span>
 *   return (
 *      <span>name: {data?.name}</span>
 *      <span>Profile picture metadata uri : {data?.profile}</span>
 *      <span>Profile picture uri : {data?.profilePicture}</span>
 *      <span>Discord id: {data?.discord}</span>
 *      <span>Twitter id: {data?.twitter}</span>
 *      <span>Github id: {data?.github}</span>
 *      <span>Proof of personhood verification: {data?.proofOfPersonhood}</span>
 *    )
 * }
 * ```
 *
 *  @example
 * This example shows how to get the stark profile of an address disabling useDefaultPfp and specifying a
 * different naming and identity contract addresses
 * ```tsx
 * function Component() {
 *   const address = '0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3'
 *   const { data, isLoading, isError } = useStarkProfile({ address, useDefaultPfp: false, namingContract: '0x1234', identityContract: '0x5678' })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error fetching profile...</span>
 *   return (
 *      <span>name: {data?.name}</span>
 *      <span>Profile picture metadata uri : {data?.profile}</span>
 *      <span>Profile picture uri : {data?.profilePicture}</span>
 *      <span>Discord id: {data?.discord}</span>
 *      <span>Twitter id: {data?.twitter}</span>
 *      <span>Github id: {data?.github}</span>
 *      <span>Proof of personhood verification: {data?.proofOfPersonhood}</span>
 *    )
 * }
 * ```
 */
export function useStarkProfile({
  address,
  useDefaultPfp = true,
  namingContract,
  identityContract,
  enabled: enabled_ = true,
  ...props
}: StarkProfileArgs): useStarkProfileResult {
  const { provider } = useProvider();
  const { chain } = useNetwork();
  const { contract: multicallContract } = useContract({
    abi: multicallABI,
    address: (StarknetIdcontracts[chain.network] as any)["multicall"],
  });

  const enabled = useMemo(
    () => Boolean(enabled_ && address),
    [enabled_, address]
  );

  return useQuery({
    queryKey: queryKey({ address, namingContract, identityContract }),
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
    ...props,
  });
}

function queryKey({
  address,
  namingContract,
  identityContract,
}: {
  address?: string;
  namingContract?: string;
  identityContract?: string;
}) {
  return [
    { entity: "starkprofile", address, namingContract, identityContract },
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
}: StarkProfileArgs & { provider: ProviderInterface } & { network?: string } & {
  multicallContract?: ContractInterface;
}) {
  return async function () {
    if (!address) throw new Error("address is required");
    if (!multicallContract) throw new Error("multicallContract is required");
    if (!network) throw new Error("network is required");

    const contracts = StarknetIdcontracts[network] as Record<string, string>;
    const identity = identityContract ?? (contracts["identity"] as string);
    const naming = namingContract ?? (contracts["naming"] as string);

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
          selector: hardcoded(hash.getSelectorFromName("domain_to_token_id")),
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
            hash.getSelectorFromName("get_extended_verifier_data")
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
      const twitter =
        data[2][0] !== BigInt(0) ? data[2][0].toString() : undefined;
      const github =
        data[3][0] !== BigInt(0) ? data[3][0].toString() : undefined;
      const discord =
        data[4][0] !== BigInt(0) ? data[4][0].toString() : undefined;
      const proofOfPersonhood = data[5][0] === BigInt(1) ? true : false;

      const profile =
        data.length === 9
          ? data[8]
              .slice(1)
              .map((val: BigInt) =>
                shortString.decodeShortString(val.toString())
              )
              .join("")
          : undefined;

      // extract nft_image from profile data
      const profilePicture = profile
        ? await fetchImageUrl(profile)
        : useDefaultPfp
        ? `https://starknet.id/api/identicons/${data[1][0].toString()}`
        : undefined;

      return {
        name,
        twitter,
        github,
        discord,
        proofOfPersonhood,
        profilePicture,
        profile,
      };
    } else {
      throw new Error("Error while fetching data");
    }
  };
}

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
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Check if the "image" key exists and is not null
    if (data.image) {
      return data.image;
    } else {
      return "Image is not set";
    }
  } catch (error) {
    console.error("There was a problem fetching the image URL:", error);
    return "Error fetching data";
  }
};

const StarknetIdcontracts: Record<string, Record<string, string>> = {
  goerli: {
    naming: "0x3bab268e932d2cecd1946f100ae67ce3dff9fd234119ea2f6da57d16d29fce",
    identity:
      "0x783a9097b26eae0586373b2ce0ed3529ddc44069d1e0fbc4f66d42b69d6850d",
    verifier:
      "0x019e5204152a72891bf8cd0bed8f03593fdb29ceacd14fca587be5d9fcf87c0e",
    verifier_pop:
      "0x03528caf090179e337931ee669a5b0214041e1bae30d460ff07d2cea2c7a9106",
    verifier_pfp:
      "0x03cac3228b434259734ee0e4ff445f642206ea11adace7e4f45edd2596748698",
    multicall:
      "0x034ffb8f4452df7a613a0210824d6414dbadcddce6c6e19bf4ddc9e22ce5f970",
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
};

const multicallABI = [
  {
    type: "impl",
    name: "ComposableMulticallImpl",
    interface_name: "composable_multicall::IComposableMulticall",
  },
  {
    type: "enum",
    name: "composable_multicall::Execution",
    variants: [
      { name: "Static", type: "()" },
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
    type: "enum",
    name: "composable_multicall::DynamicFelt",
    variants: [
      { name: "Hardcoded", type: "core::felt252" },
      { name: "Reference", type: "(core::integer::u32, core::integer::u32)" },
    ],
  },
  {
    type: "enum",
    name: "composable_multicall::DynamicCalldata",
    variants: [
      { name: "Hardcoded", type: "core::felt252" },
      { name: "Reference", type: "(core::integer::u32, core::integer::u32)" },
      {
        name: "ArrayReference",
        type: "(core::integer::u32, core::integer::u32)",
      },
    ],
  },
  {
    type: "struct",
    name: "composable_multicall::DynamicCall",
    members: [
      { name: "execution", type: "composable_multicall::Execution" },
      { name: "to", type: "composable_multicall::DynamicFelt" },
      { name: "selector", type: "composable_multicall::DynamicFelt" },
      {
        name: "calldata",
        type: "core::array::Array::<composable_multicall::DynamicCalldata>",
      },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<core::felt252>",
    members: [
      { name: "snapshot", type: "@core::array::Array::<core::felt252>" },
    ],
  },
  {
    type: "interface",
    name: "composable_multicall::IComposableMulticall",
    items: [
      {
        type: "function",
        name: "aggregate",
        inputs: [
          {
            name: "calls",
            type: "core::array::Array::<composable_multicall::DynamicCall>",
          },
        ],
        outputs: [
          { type: "core::array::Array::<core::array::Span::<core::felt252>>" },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "event",
    name: "composable_multicall::contract::ComposableMulticall::Event",
    kind: "enum",
    variants: [],
  },
];
