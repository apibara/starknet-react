use option::OptionTrait;
use traits::TryInto;
use debug::PrintTrait;
use starknet::testing;

// locals
use arcade_factory::factory::contract::ArcadeFactory;

use arcade_factory::factory::interface::{ ArcadeFactoryABIDispatcher, ArcadeFactoryABIDispatcherTrait };

use super::mocks::arcade_account_mock::{
  ArcadeAccountMock,
  ArcadeAccountMockABIDispatcher,
  ArcadeAccountMockABIDispatcherTrait,
};

use super::utils;
use super::constants;

//
// Setup
//

fn setup() -> ArcadeFactoryABIDispatcher {
  let owner = constants::OWNER();

  let factory_contract_address = utils::deploy(
    contract_class_hash: ArcadeFactory::TEST_CLASS_HASH,
    calldata: array![owner.into(), ArcadeAccountMock::TEST_CLASS_HASH]
  );

  ArcadeFactoryABIDispatcher { contract_address: factory_contract_address }
}

//
// Tests
//

// Cannot test address computation with current cairo version

#[test]
#[available_gas(20000000)]
fn test_arcade_account_implementation() {
  let factory = setup();

  assert(
    factory.arcade_account_implementation() == ArcadeAccountMock::TEST_CLASS_HASH.try_into().unwrap(),
    'Invalid arcade account impl'
  );
}

#[test]
#[available_gas(20000000)]
fn test_deploy() {
  let factory = setup();

  // deploy
  let arcade_account_address = factory.deploy(
    salt: constants::SALT,
    public_key: constants::PUBLIC_KEY,
    master_account: constants::MASTER()
  );

  let arcade_account = ArcadeAccountMockABIDispatcher { contract_address: arcade_account_address };

  assert(arcade_account.public_key() == constants::PUBLIC_KEY, 'Invalid public key');
  assert(arcade_account.master_account() == constants::MASTER(), 'Invalid master account');
}

// Upgrade

#[test]
#[available_gas(20000000)]
#[should_panic(expected: ('Caller is not the owner', 'ENTRYPOINT_FAILED',))]
fn test_upgrade_unauthorized() {
  let factory = setup();

  testing::set_contract_address(constants::OTHER());
  factory.upgrade(new_class_hash: 'new class hash'.try_into().unwrap());
}

#[test]
#[available_gas(20000000)]
#[should_panic(expected: ('Caller is the zero address', 'ENTRYPOINT_FAILED',))]
fn test_upgrade_from_zero() {
  let factory = setup();

  testing::set_contract_address(constants::ZERO());
  factory.upgrade(new_class_hash: 'new class hash'.try_into().unwrap());
}
