#[starknet::contract]
mod ArcadeFactory {
  use openzeppelin::access::ownable::OwnableComponent;
  use openzeppelin::upgrades::UpgradeableComponent;

  // locals
  use arcade_factory::factory::factory::FactoryComponent;

  use arcade_factory::factory::interface;

  //
  // Components
  //

  component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
  component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

  component!(path: FactoryComponent, storage: factory, event: FactoryEvent);

  // Ownable
  #[abi(embed_v0)]
  impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
  impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

  // Upgradeable
  impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

  // Factory
  #[abi(embed_v0)]
  impl FactoryImpl = FactoryComponent::FactoryImpl<ContractState>;
  impl FactoryInternalImpl = FactoryComponent::InternalImpl<ContractState>;

  //
  // Events
  //

  #[event]
  #[derive(Drop, starknet::Event)]
  enum Event {
    #[flat]
    OwnableEvent: OwnableComponent::Event,

    #[flat]
    UpgradeableEvent: UpgradeableComponent::Event,

    #[flat]
    FactoryEvent: FactoryComponent::Event,
  }

  //
  // Storage
  //

  #[storage]
  struct Storage {
    #[substorage(v0)]
    ownable: OwnableComponent::Storage,

    #[substorage(v0)]
    upgradeable: UpgradeableComponent::Storage,

    #[substorage(v0)]
    factory: FactoryComponent::Storage,
  }

  //
  // Constructor
  //

  #[constructor]
  fn constructor(
    ref self: ContractState,
    owner: starknet::ContractAddress,
    arcade_account_implementation: starknet::ClassHash
  ) {
    self.ownable.initializer(:owner);
    self.factory.initializer(:arcade_account_implementation);
  }

  //
  // Upgrade
  //

  #[external(v0)]
  fn upgrade(ref self: ContractState, new_class_hash: starknet::ClassHash) {
    // only owner
    self.ownable.assert_only_owner();

    // set new impl
    self.upgradeable._upgrade(:new_class_hash);
  }

  //
  // Factory
  //

  #[external(v0)]
  // method name cannot be too long :/
  fn set_arcade_account_impl(ref self: ContractState, arcade_account_implementation: starknet::ClassHash) {
    // only owner
    self.ownable.assert_only_owner();

    // set new impl
    self.factory._set_arcade_account_implementation(:arcade_account_implementation);
  }
}
