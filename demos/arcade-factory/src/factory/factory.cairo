#[starknet::component]
mod FactoryComponent {
  use starknet::SyscallResultTrait;

  // locals
  use arcade_factory::factory::interface;

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
      let mut calldata_hash = pedersen::pedersen(calldata_hash, master_account.into());
      calldata_hash = pedersen::pedersen(calldata_hash, 2);

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
      let calldata = array![public_key, master_account.into()];

      let (arcade_contract_address, _) = starknet::syscalls::deploy_syscall(
        class_hash: arcade_account_implementation_,
        contract_address_salt: salt,
        calldata: calldata.span(),
        deploy_from_zero: true
      ).unwrap_syscall();

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
    fn initializer(ref self: ComponentState<TContractState>, arcade_account_implementation_: starknet::ClassHash) {
      self._arcade_account_implementation.write(arcade_account_implementation_);
    }
  }
}
