#[starknet::interface]
trait ArcadeAccountMockABI<TState> {
  fn public_key(self: @TState) -> felt252;
  fn master_account(self: @TState) -> starknet::ContractAddress;

  fn set_master_account(ref self: TState, master_account: starknet::ContractAddress);
}

// Using a mock instead of the real impl of the arcade account because of OZ versions conflict
#[starknet::contract]
mod ArcadeAccountMock {
  // locals
  use super::ArcadeAccountMockABI;

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
  fn constructor(ref self: ContractState, public_key: felt252) {
    self._public_key.write(public_key);
  }

  //
  // ArcadeAccountMockABI
  //

  #[external(v0)]
  impl ArcadeAccountMockImpl of ArcadeAccountMockABI<ContractState> {
    fn public_key(self: @ContractState) -> felt252 {
      self._public_key.read()
    }

    fn master_account(self: @ContractState) -> starknet::ContractAddress {
      self._master_account.read()
    }

    fn set_master_account(ref self: ContractState, master_account: starknet::ContractAddress) {
      self._master_account.write(master_account);
    }
  }
}
