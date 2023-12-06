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

fn setup_ether(
  recipient: starknet::ContractAddress,
  expected_address: starknet::ContractAddress
) -> starknet::ContractAddress {
  let mut calldata = array![];

  calldata.append_serde('Ether');
  calldata.append_serde('ETH');
  calldata.append_serde(1_000_000_000_000_000_000_u256); // 1 ETH
  calldata.append_serde(recipient);

  // deploy
  let ether_contract_address = deploy(SnakeERC20Mock::TEST_CLASS_HASH, calldata);

  // make sure the contract has been deployed with the right address
  assert(ether_contract_address == expected_address, 'Bad deployment order');

  ether_contract_address
}

fn setup_account(public_key: felt252, expected_address: starknet::ContractAddress) -> AccountABIDispatcher {
  let calldata = array![public_key];

  let signer_address = deploy(SnakeAccountMock::TEST_CLASS_HASH, calldata);

  // make sure the contract has been deployed with the right address
  assert(signer_address == expected_address, 'Bad deployment order');

  AccountABIDispatcher { contract_address: signer_address }
}

// Events

fn drop_event(address: starknet::ContractAddress) {
  testing::pop_log_raw(address);
}

fn drop_events(address: starknet::ContractAddress, count: felt252) {
  let mut _count = count;
  loop {
    if _count == 0 {
        break;
    }
    drop_event(address);
    _count -= 1;
  }
}
