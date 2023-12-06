#[starknet::component]
mod CounterComponent {
  use integer::BoundedU64;

  use openzeppelin::introspection::dual_src5::{ DualCaseSRC5Trait, DualCaseSRC5 };

  // locals
  use demo_contracts::arcade_counter::interface;

  use demo_contracts::arcade_account::interface::{
    ArcadeAccountABIDispatcher,
    ArcadeAccountABIDispatcherTrait,
    ARCADE_ACCOUNT_ID,
  };

  //
  // Storage
  //

  #[storage]
  struct Storage {
    _counter: LegacyMap<starknet::ContractAddress, u64>,
  }

  //
  // ICounter
  //

  #[embeddable_as(CounterImpl)]
  impl Counter<
    TContractState,
    +HasComponent<TContractState>,
    +Drop<TContractState>,
  > of interface::ICounter<ComponentState<TContractState>> {
    fn counter(self: @ComponentState<TContractState>, master_account: starknet::ContractAddress) -> u64 {
      self._counter.read(master_account)
    }

    fn increment(ref self: ComponentState<TContractState>) {
      let master_account = self._get_caller_master_account();

      // increment
      let counter_ = self._counter.read(master_account);

      assert(counter_ < BoundedU64::max(), 'Max counter reached');

      self._counter.write(master_account, counter_ + 1);
    }

    fn decrement(ref self: ComponentState<TContractState>) {
      let master_account = self._get_caller_master_account();

      // increment
      let counter_ = self._counter.read(master_account);

      assert(counter_ > BoundedU64::min(), 'Min counter reached');

      self._counter.write(master_account, counter_ - 1);
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
    fn _get_caller_master_account(self: @ComponentState<TContractState>) -> starknet::ContractAddress {
      // assert caller is an arcade account
      let caller = starknet::get_caller_address();

      assert(
        DualCaseSRC5 { contract_address: caller }.supports_interface(ARCADE_ACCOUNT_ID),
        'Caller is not an arcade account'
      );

      // get master account
      let arcade_account = ArcadeAccountABIDispatcher { contract_address: caller };

      arcade_account.get_master_account()
    }
  }
}
