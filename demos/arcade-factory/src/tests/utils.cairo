use starknet::testing;

fn deploy(contract_class_hash: felt252, calldata: Array<felt252>) -> starknet::ContractAddress {
  let (address, _) = starknet::deploy_syscall(contract_class_hash.try_into().unwrap(), 0, calldata.span(), false)
    .unwrap();

  address
}
