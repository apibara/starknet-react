#[starknet::interface]
trait ArcadeAccountMockABI<TState> {
  fn public_key(self: @TState) -> felt252;
  fn master_account(self: @TState) -> starknet::ContractAddress;

  fn set_master_account(ref self: TState, master_account: starknet::ContractAddress);
}

// Using a mock instead of the real impl of the arcade account because of OZ versions conflict
#[starknet::contract]
mod ArcadeAccountMock {
  use openzeppelin::introspection::src5::SRC5Component;

  // locals
  use super::ArcadeAccountMockABI;

  component!(path: SRC5Component, storage: src5, event: SRC5Event);

  // Components

  #[abi(embed_v0)]
  impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

  //
  // Events
  //

  #[event]
  #[derive(Drop, starknet::Event)]
  enum Event {
    #[flat]
    SRC5Event: SRC5Component::Event,
  }

  //
  // Storage
  //

  #[storage]
  struct Storage {
    _public_key: felt252,
    _master_account: starknet::ContractAddress,

    #[substorage(v0)]
    src5: SRC5Component::Storage,
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

#[starknet::contract]
mod ValidArcadeAccountMock {
  use openzeppelin::introspection::src5::SRC5Component;

  // locals

  component!(path: SRC5Component, storage: src5, event: SRC5Event);

  // Components

  #[abi(embed_v0)]
  impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

  //
  // Events
  //

  #[event]
  #[derive(Drop, starknet::Event)]
  enum Event {
    #[flat]
    SRC5Event: SRC5Component::Event,
  }

  //
  // Storage
  //

  #[storage]
  struct Storage {
    #[substorage(v0)]
    src5: SRC5Component::Storage,
  }
}

#[starknet::contract]
mod InvalidArcadeAccountMock {
  // locals
  use arcade_factory::account::interface;

  //
  // Storage
  //

  #[storage]
  struct Storage { }

  //
  // SRC5
  //

  #[external(v0)]
  fn supports_interface(self: @ContractState, interface_id: felt252) -> bool {
    false
  }
}
