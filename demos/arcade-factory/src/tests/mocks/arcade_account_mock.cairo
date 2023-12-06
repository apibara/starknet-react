#[starknet::interface]
trait ArcadeAccountMockABI<TState> {
  fn public_key(self: @TState) -> felt252;
  fn master_account(self: @TState) -> starknet::ContractAddress;
}

// Using a mock instead of the real impl of the arcade account because of OZ versions conflict
#[starknet::contract]
mod ArcadeAccountMock {

  //
  // Storage
  //

  #[storage]
  struct Storage {
    _public_key: felt252,
    _master_account: starknet::ContractAddress,
  }

  //
  // Constructor
  //

  #[constructor]
  fn constructor(ref self: ContractState, public_key: felt252, master_account: starknet::ContractAddress) {
    self._public_key.write(public_key);
    self._master_account.write(master_account);
  }

  #[external(v0)]
  fn public_key(self: @ContractState) -> felt252 {
    self._public_key.read()
  }

  #[external(v0)]
  fn master_account(self: @ContractState) -> starknet::ContractAddress {
    self._master_account.read()
  }
}
