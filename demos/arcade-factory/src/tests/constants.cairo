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

// misc

const PUBLIC_KEY: felt252 = 'PUBLIC_KEY';

const SALT: felt252 = 'SALTY';
