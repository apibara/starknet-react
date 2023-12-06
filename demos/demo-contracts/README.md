# Demo contracts

This demo contains a set of Cairo contracts, designed specifically for testing and validation purposes. The primary objective is to facilitate the testing of other smart contracts by providing simple and modular examples.

### Arcade counter

This smart contract functions as a counter and includes both an `increment` and `decrement` function. The counter is uniquely associated with a master account, when the contract is invoked by an arcade account, it utilizes the master account's address for the operation.

```
class               : 0x0501a3c0ca52309de808cfa6624d0605b38f1b8caa917e1b0f331d3c3218ffcc
contract (goerli-1) : 0x02d1d73244fafa6752550af3343451dda9ed52b364edeab918f97552b064c08d
```
