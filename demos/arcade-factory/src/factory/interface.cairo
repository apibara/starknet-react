use array::{ ArrayTrait, SpanSerde };

//
// Interfaces
//

#[starknet::interface]
trait IFactory<TState> {
  fn arcade_account_implementation(self: @TState) -> starknet::ClassHash;

  fn compute_address(
    self: @TState,
    salt: felt252,
    public_key: felt252,
    master_account: starknet::ContractAddress
  ) -> starknet::ContractAddress;

  fn deploy(
    ref self: TState,
    salt: felt252,
    public_key: felt252,
    master_account: starknet::ContractAddress
  ) -> starknet::ContractAddress;
}

//
// ABI
//

#[starknet::interface]
trait ArcadeFactoryABI<TState> {
  // IFactory
  fn arcade_account_implementation(self: @TState) -> starknet::ClassHash;
  fn set_arcade_account_impl(ref self: TState, arcade_account_implementation: starknet::ClassHash);
  fn compute_address(
    self: @TState,
    salt: felt252,
    public_key: felt252,
    master_account: starknet::ContractAddress
  ) -> starknet::ContractAddress;

  fn deploy(
    ref self: TState,
    salt: felt252,
    public_key: felt252,
    master_account: starknet::ContractAddress
  ) -> starknet::ContractAddress;

  // Upgradeable
  fn upgrade(ref self: TState, new_class_hash: starknet::ClassHash);

  // Ownable
  fn owner(self: @TState) -> starknet::ContractAddress;

  fn transfer_ownership(ref self: TState, new_owner: starknet::ContractAddress);
  fn renounce_ownership(ref self: TState);
}
