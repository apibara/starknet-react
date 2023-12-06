use math::Oneable;
use zeroable::Zeroable;
use option::OptionTrait;
use traits::TryInto;
use debug::PrintTrait;
use integer::BoundedU64;
use starknet::testing;

use openzeppelin::presets::Account;
use openzeppelin::account::interface::{ AccountABIDispatcher, AccountABIDispatcherTrait };

// locals
use demo_contracts::arcade_counter::contract::ArcadeCounter;
use demo_contracts::arcade_counter::counter::CounterComponent;

use demo_contracts::arcade_counter::interface::{ ArcadeCounterABIDispatcher, ArcadeCounterABIDispatcherTrait };

use demo_contracts::arcade_account::interface::{ ArcadeAccountABIDispatcher, ArcadeAccountABIDispatcherTrait };

use super::mocks::arcade_account_mock::ArcadeAccountMock;

use super::utils;
use super::constants;

//
// Setup
//

fn setup() -> ArcadeCounterABIDispatcher {
  let owner = constants::OWNER();

  let arcade_counter_address = utils::deploy(contract_class_hash: ArcadeCounter::TEST_CLASS_HASH, calldata: array![]);

  ArcadeCounterABIDispatcher { contract_address: arcade_counter_address }
}

fn setup_arcade_account() -> ArcadeAccountABIDispatcher {
  let arcade_account_address = utils::deploy(
    contract_class_hash: ArcadeAccountMock::TEST_CLASS_HASH,
    calldata: array![constants::PUBLIC_KEY, constants::MASTER().into()]
  );

  ArcadeAccountABIDispatcher { contract_address: arcade_account_address }
}

fn setup_account() -> AccountABIDispatcher {
  let account_address = utils::deploy(
    contract_class_hash: Account::TEST_CLASS_HASH,
    calldata: array![constants::PUBLIC_KEY]
  );

  AccountABIDispatcher { contract_address: account_address }
}

//
// Tests
//

// Increment

#[test]
#[available_gas(20000000)]
fn test_increment() {
  let arcade_counter = setup();
  let arcade_account = setup_arcade_account();

  // get master account
  let master_account = arcade_account.get_master_account();

  assert(arcade_counter.counter(:master_account).is_zero(), 'Invalid counter before');

  // increment
  testing::set_contract_address(arcade_account.contract_address);
  arcade_counter.increment();

  assert(arcade_counter.counter(:master_account).is_one(), 'Invalid counter after');
  assert(arcade_counter.counter(master_account: constants::OTHER()).is_zero(), 'Invalid other counter after');
}

#[test]
#[available_gas(20000000)]
fn test_increment_mulitple() {
  let arcade_counter = setup();
  let arcade_account = setup_arcade_account();

  // get master account
  let master_account = arcade_account.get_master_account();

  assert(arcade_counter.counter(:master_account).is_zero(), 'Invalid counter before');

  // increment
  testing::set_contract_address(arcade_account.contract_address);
  arcade_counter.increment();
  arcade_counter.increment();
  arcade_counter.increment();
  arcade_counter.increment();
  arcade_counter.increment();

  assert(arcade_counter.counter(:master_account) == 5, 'Invalid counter after');
  assert(arcade_counter.counter(master_account: constants::OTHER()).is_zero(), 'Invalid other counter after');
}

#[test]
#[available_gas(20000000)]
#[should_panic(expected: ('Max counter reached', 'ENTRYPOINT_FAILED'))]
fn test_increment_above_limit() {
  let arcade_counter = setup();
  let arcade_account = setup_arcade_account();

  // get master account
  let master_account = arcade_account.get_master_account();

  // manually set counter value
  arcade_counter.set_counter(:master_account, value: BoundedU64::max());

  // increment
  testing::set_contract_address(arcade_account.contract_address);
  arcade_counter.increment();
}

#[test]
#[available_gas(20000000)]
#[should_panic(expected: ('Caller is not an arcade account', 'ENTRYPOINT_FAILED'))]
fn test_increment_from_invalid() {
  let arcade_counter = setup();
  let account = setup_account();

  // increment
  testing::set_contract_address(account.contract_address);
  arcade_counter.increment();
}

// Decrement

#[test]
#[available_gas(20000000)]
fn test_decrement() {
  let arcade_counter = setup();
  let arcade_account = setup_arcade_account();
  let counter_init = 0x42;

  // get master account
  let master_account = arcade_account.get_master_account();

  // manually set counter value
  arcade_counter.set_counter(:master_account, value: counter_init);

  assert(arcade_counter.counter(:master_account) == counter_init, 'Invalid counter before');

  // decrement
  testing::set_contract_address(arcade_account.contract_address);
  arcade_counter.decrement();

  assert(arcade_counter.counter(:master_account) == counter_init - 1, 'Invalid counter after');
  assert(arcade_counter.counter(master_account: constants::OTHER()).is_zero(), 'Invalid other counter after');
}

#[test]
#[available_gas(20000000)]
fn test_decrement_mulitple() {
  let arcade_counter = setup();
  let arcade_account = setup_arcade_account();
  let counter_init = 0x42;

  // get master account
  let master_account = arcade_account.get_master_account();

  // manually set counter value
  arcade_counter.set_counter(:master_account, value: counter_init);

  assert(arcade_counter.counter(:master_account) == counter_init, 'Invalid counter before');

  // decrement
  testing::set_contract_address(arcade_account.contract_address);
  arcade_counter.decrement();
  arcade_counter.decrement();
  arcade_counter.decrement();
  arcade_counter.decrement();
  arcade_counter.decrement();

  assert(arcade_counter.counter(:master_account) == counter_init - 5, 'Invalid counter after');
  assert(arcade_counter.counter(master_account: constants::OTHER()).is_zero(), 'Invalid other counter after');
}

#[test]
#[available_gas(20000000)]
#[should_panic(expected: ('Min counter reached', 'ENTRYPOINT_FAILED'))]
fn test_decrement_bellow_limit() {
  let arcade_counter = setup();
  let arcade_account = setup_arcade_account();

  let master_account = arcade_account.get_master_account();

  // increment
  testing::set_contract_address(arcade_account.contract_address);
  arcade_counter.decrement();
}

#[test]
#[available_gas(20000000)]
#[should_panic(expected: ('Caller is not an arcade account', 'ENTRYPOINT_FAILED'))]
fn test_decrement_from_invalid() {
  let arcade_counter = setup();
  let account = setup_account();

  // increment
  testing::set_contract_address(account.contract_address);
  arcade_counter.decrement();
}

// Counter

#[test]
#[available_gas(20000000)]
fn test_counter() {
  let arcade_counter = setup();

  let master_1 = constants::MASTER();
  let master_2 = constants::OTHER();

  // counter check
  arcade_counter.set_counter(master_account: master_1, value: 0x42);

  assert(arcade_counter.counter(master_account: master_1) == 0x42, 'Invalid counter - 1');
  assert(arcade_counter.counter(master_account: master_2).is_zero(), 'Invalid counter - 2');

  // another counter check
  arcade_counter.set_counter(master_account: master_2, value: 0xdead);

  assert(arcade_counter.counter(master_account: master_1) == 0x42, 'Invalid counter - 2');
  assert(arcade_counter.counter(master_account: master_2) == 0xdead, 'Invalid counter - 3');
}
