#[starknet::contract]
mod ArcadeCounter {
  // locals
  use demo_contracts::arcade_counter::counter::CounterComponent;

  //
  // Components
  //

  component!(path: CounterComponent, storage: counter, event: CounterEvent);

  // Factory
  #[abi(embed_v0)]
  impl FactoryImpl = CounterComponent::CounterImpl<ContractState>;

  //
  // Events
  //

  #[event]
  #[derive(Drop, starknet::Event)]
  enum Event {
    #[flat]
    CounterEvent: CounterComponent::Event,
  }

  //
  // Storage
  //

  #[storage]
  struct Storage {
    #[substorage(v0)]
    counter: CounterComponent::Storage,
  }
}
