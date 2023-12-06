// Using a mock instead of the real impl of the arcade account because of OZ versions conflict
#[starknet::contract]
mod ArcadeAccountMock {
  use openzeppelin::introspection::src5::SRC5Component;
  use openzeppelin::introspection::src5::SRC5Component::InternalTrait;

  // locals
  use demo_contracts::arcade_account::interface;

  component!(path: SRC5Component, storage: src5, event: SRC5Event);

  // Components

  // SRC5
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
    _master_account: starknet::ContractAddress,

    #[substorage(v0)]
    src5: SRC5Component::Storage,
  }

  //
  // Constructor
  //

  #[constructor]
  fn constructor(ref self: ContractState, public_key: felt252, master_account: starknet::ContractAddress) {
    self.src5.register_interface(interface::ARCADE_ACCOUNT_ID);

    self._master_account.write(master_account);
  }

  //
  // ArcadeAccountABI
  //

  #[external(v0)]
  impl ArcadeAccountImpl of interface::ArcadeAccountABI<ContractState> {
    fn get_master_account(self: @ContractState) -> starknet::ContractAddress {
      self._master_account.read()
    }
  }
}
