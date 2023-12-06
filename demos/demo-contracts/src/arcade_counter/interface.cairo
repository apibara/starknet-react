//
// Interfaces
//

#[starknet::interface]
trait ICounter<TState> {
  fn counter(self: @TState, master_account: starknet::ContractAddress) -> u64;

  fn increment(ref self: TState);

  fn decrement(ref self: TState);

  fn set_counter(ref self: TState, master_account: starknet::ContractAddress, value: u64);
}

//
// ABI
//

#[starknet::interface]
trait ArcadeCounterABI<TState> {
  // ICounter
  fn counter(self: @TState, master_account: starknet::ContractAddress) -> u64;

  fn increment(ref self: TState);
  fn decrement(ref self: TState);
  fn set_counter(ref self: TState, master_account: starknet::ContractAddress, value: u64);
}
