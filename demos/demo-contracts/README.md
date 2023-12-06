# Demo contracts

This demo contains a set of Cairo contracts, designed specifically for testing and validation purposes. The primary objective is to facilitate the testing of other smart contracts by providing simple and modular examples.

### Arcade counter

This smart contract functions as a counter and includes both an `increment` and `decrement` function. The counter is uniquely associated with a master account, when the contract is invoked by an arcade account, it utilizes the master account's address for the operation.
