use starknet::testing;

use openzeppelin::utils::serde::SerializedAppend;

use openzeppelin::tests::mocks::erc20_mocks::SnakeERC20Mock;
use openzeppelin::token::erc20::dual20::DualCaseERC20Trait;

use openzeppelin::account::AccountABIDispatcher;
use openzeppelin::tests::mocks::account_mocks::SnakeAccountMock;

// locals
use super::constants;

fn deploy(contract_class_hash: felt252, calldata: Array<felt252>) -> starknet::ContractAddress {
  let (address, _) = starknet::deploy_syscall(contract_class_hash.try_into().unwrap(), 0, calldata.span(), false)
    .unwrap();

  address
}
