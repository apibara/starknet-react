use openzeppelin::token::erc20::dual20::DualCaseERC20;

mod VALID {
}

mod INVALID {
}

// addresses

fn OWNER() -> starknet::ContractAddress {
  starknet::contract_address_const::<'OWNER'>()
}

fn OTHER() -> starknet::ContractAddress {
  starknet::contract_address_const::<'OTHER'>()
}

fn ZERO() -> starknet::ContractAddress {
  starknet::contract_address_const::<0>()
}

fn MASTER() -> starknet::ContractAddress {
  starknet::contract_address_const::<'MASTER'>()
}

// contracts

fn ETHER() -> DualCaseERC20 {
  DualCaseERC20 { contract_address: starknet::contract_address_const::<1>() }
}

// misc

const PUBLIC_KEY: felt252 = 'PUBLIC_KEY';

const SALT: felt252 = 'SALTY';
