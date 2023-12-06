#[starknet::interface]
trait ArcadeAccountABI<TState> {
  fn set_master_account(ref self: TState, master_account: starknet::ContractAddress);
}
