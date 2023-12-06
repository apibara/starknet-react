const ARCADE_ACCOUNT_ID: felt252 = 22227699753170493970302265346292000442692;

#[starknet::interface]
trait ArcadeAccountABI<TState> {
  fn get_master_account(self: @TState) -> starknet::ContractAddress;
}
