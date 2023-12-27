import { Abi } from "starknet";

export const abi = [
  {
    name: "OwnableImpl",
    type: "impl",
    interface_name: "openzeppelin::access::ownable::interface::IOwnable",
  },
  {
    name: "openzeppelin::access::ownable::interface::IOwnable",
    type: "interface",
    items: [
      {
        name: "owner",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "transfer_ownership",
        type: "function",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "renounce_ownership",
        type: "function",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "FactoryImpl",
    type: "impl",
    interface_name: "arcade_factory::factory::interface::IFactory",
  },
  {
    name: "arcade_factory::factory::interface::IFactory",
    type: "interface",
    items: [
      {
        name: "compute_address",
        type: "function",
        inputs: [
          {
            name: "salt",
            type: "core::felt252",
          },
          {
            name: "public_key",
            type: "core::felt252",
          },
          {
            name: "master_account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "deploy",
        type: "function",
        inputs: [
          {
            name: "salt",
            type: "core::felt252",
          },
          {
            name: "public_key",
            type: "core::felt252",
          },
          {
            name: "master_account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "arcade_account_implementation_",
        type: "core::starknet::class_hash::ClassHash",
      },
    ],
  },
  {
    name: "upgrade",
    type: "function",
    inputs: [
      {
        name: "new_class_hash",
        type: "core::starknet::class_hash::ClassHash",
      },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    kind: "struct",
    name: "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    type: "event",
    members: [
      {
        kind: "data",
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "enum",
    name: "openzeppelin::access::ownable::ownable::OwnableComponent::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "OwnershipTransferred",
        type: "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferred",
      },
    ],
  },
  {
    kind: "struct",
    name: "openzeppelin::upgrades::upgradeable::UpgradeableComponent::Upgraded",
    type: "event",
    members: [
      {
        kind: "data",
        name: "class_hash",
        type: "core::starknet::class_hash::ClassHash",
      },
    ],
  },
  {
    kind: "enum",
    name: "openzeppelin::upgrades::upgradeable::UpgradeableComponent::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "Upgraded",
        type: "openzeppelin::upgrades::upgradeable::UpgradeableComponent::Upgraded",
      },
    ],
  },
  {
    kind: "enum",
    name: "arcade_factory::factory::factory::FactoryComponent::Event",
    type: "event",
    variants: [],
  },
  {
    kind: "enum",
    name: "arcade_factory::factory::contract::ArcadeFactory::Event",
    type: "event",
    variants: [
      {
        kind: "flat",
        name: "OwnableEvent",
        type: "openzeppelin::access::ownable::ownable::OwnableComponent::Event",
      },
      {
        kind: "flat",
        name: "UpgradeableEvent",
        type: "openzeppelin::upgrades::upgradeable::UpgradeableComponent::Event",
      },
      {
        kind: "flat",
        name: "FactoryEvent",
        type: "arcade_factory::factory::factory::FactoryComponent::Event",
      },
    ],
  },
] satisfies Abi;
