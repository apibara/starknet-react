use math::Oneable;
use zeroable::Zeroable;
use option::OptionTrait;
use traits::TryInto;
use debug::PrintTrait;
use starknet::testing;

// locals
use demo_contracts::arcade_counter::contract::ArcadeCounter;

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

//
// Tests
//

// Increment

#[test]
#[available_gas(20000000)]
fn test_increment() {
  let arcade_counter = setup();
  let arcade_account = setup_arcade_account();

  let master_account = arcade_account.get_master_account();

  assert(arcade_counter.counter(:master_account).is_zero(), 'Invalid counter before');

  // increment
  testing::set_contract_address(arcade_account.contract_address);
  arcade_counter.increment();

  assert(arcade_counter.counter(:master_account).is_one(), 'Invalid counter after');
}
