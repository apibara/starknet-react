#[starknet::component]
mod FactoryComponent {
  use starknet::SyscallResultTrait;

  use openzeppelin::utils::selectors;
  use openzeppelin::introspection::interface::ISRC5_ID;

  // locals
  use arcade_factory::factory::interface;

  use arcade_factory::account::interface::{
    ARCADE_ACCOUNT_ID,
    ArcadeAccountABIDispatcher,
    ArcadeAccountABIDispatcherTrait,
  };

  const CONTRACT_ADDRESS_PREFIX: felt252 = 'STARKNET_CONTRACT_ADDRESS';

  //
  // Storage
  //

  #[storage]
  struct Storage {
    _arcade_account_implementation: starknet::ClassHash,
  }

  //
  // IFactory
  //

  #[embeddable_as(FactoryImpl)]
  impl Factory<
    TContractState,
    +HasComponent<TContractState>,
    +Drop<TContractState>,
  > of interface::IFactory<ComponentState<TContractState>> {
    fn arcade_account_implementation(self: @ComponentState<TContractState>) -> starknet::ClassHash {
      self._arcade_account_implementation.read()
    }

    fn compute_address(
      self: @ComponentState<TContractState>,
      salt: felt252,
      public_key: felt252,
      master_account: starknet::ContractAddress,
    ) -> starknet::ContractAddress {
      // class hash
      let arcade_account_implementation_ = self._arcade_account_implementation.read();
      let class_hash = arcade_account_implementation_.into();

      // deployer (always zero)
      let deployer_address = 0;

      // calldata
      let mut calldata_hash = pedersen::pedersen(0, public_key);
      calldata_hash = pedersen::pedersen(calldata_hash, 1);

      // compute address
      let mut address = pedersen::pedersen(0, CONTRACT_ADDRESS_PREFIX);
      address = pedersen::pedersen(address, 0);
      address = pedersen::pedersen(address, salt);
      address = pedersen::pedersen(address, class_hash);
      address = pedersen::pedersen(address, calldata_hash);

      pedersen::pedersen(address, 5).try_into().unwrap()
    }

    fn deploy(
      ref self: ComponentState<TContractState>,
      salt: felt252,
      public_key: felt252,
      master_account: starknet::ContractAddress
    ) -> starknet::ContractAddress {
      // class hash
      let arcade_account_implementation_ = self._arcade_account_implementation.read();

      // calldata
      let calldata = array![public_key];

      let (arcade_contract_address, _) = starknet::syscalls::deploy_syscall(
        class_hash: arcade_account_implementation_,
        contract_address_salt: salt,
        calldata: calldata.span(),
        deploy_from_zero: true
      ).unwrap_syscall();

      // setup master account
      let arcade_account = ArcadeAccountABIDispatcher { contract_address: arcade_contract_address };

      arcade_account.set_master_account(:master_account);

      return arcade_contract_address;
    }
  }

  //
  // Internals
  //

  #[generate_trait]
  impl InternalImpl<
    TContractState,
    +HasComponent<TContractState>,
    +Drop<TContractState>,
  > of InternalTrait<TContractState> {
    fn initializer(ref self: ComponentState<TContractState>, arcade_account_implementation: starknet::ClassHash) {
      self._set_arcade_account_implementation(:arcade_account_implementation);
    }

    fn _set_arcade_account_implementation(
      ref self: ComponentState<TContractState>,
      arcade_account_implementation: starknet::ClassHash
    ) {
      // check that the new implementation is a valid class hash
      // we cannot check if the implementation register to the arcade account interface
      // but we can check if the implementation supports SRC5
      let ret_data = starknet::library_call_syscall(
        class_hash: arcade_account_implementation,
        function_selector: selectors::supports_interface,
        calldata: array![ISRC5_ID].span()
      ).unwrap_syscall();

      assert((ret_data.len() == 1) & (*ret_data.at(0) == true.into()), 'Invalid arcade account impl');

      // update implementation
      self._arcade_account_implementation.write(arcade_account_implementation);
    }
  }
}
