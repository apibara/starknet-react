// addresses

fn OTHER() -> starknet::ContractAddress {
  starknet::contract_address_const::<'OTHER'>()
}

fn MASTER() -> starknet::ContractAddress {
  starknet::contract_address_const::<'MASTER'>()
}

// misc

const PUBLIC_KEY: felt252 = 'PUBLIC_KEY';
