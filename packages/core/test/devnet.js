'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.compiledDapp =
  exports.compiledErc20 =
  exports.connectors =
  exports.mockedConnector =
  exports.deventAccounts =
  exports.invalidProvider =
  exports.devnetProvider =
  exports.DEVNET_ACCOUNTS =
    void 0
const fs_1 = __importDefault(require('fs'))
const moq_ts_1 = require('moq.ts')
const starknet_1 = require('starknet')
const DEFAULT_DEVNET_URL = 'http://localhost:5050'
const DEVNET_URL = process.env.DEVNET_URL || DEFAULT_DEVNET_URL
exports.DEVNET_ACCOUNTS = [
  {
    address: '0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a',
    secret: '0xe3e70682c2094cac629f6fbed82c07cd',
  },
  {
    address: '0x69b49c2cc8b16e80e86bfc5b0614a59aa8c9b601569c7b80dde04d3f3151b79',
    secret: '0xf728b4fa42485e3a0a5d2f346baa9455',
  },
  {
    address: '0x7447084f620ba316a42c72ca5b8eefb3fe9a05ca5fe6430c65a69ecc4349b3b',
    secret: '0xeb1167b367a9c3787c65c1e582e2e662',
  },
]
exports.devnetProvider = new starknet_1.SequencerProvider({ baseUrl: DEVNET_URL })
const originalWaitForTransaction = exports.devnetProvider.waitForTransaction.bind(
  exports.devnetProvider
)
exports.devnetProvider.waitForTransaction = (txHash, retryInterval) => {
  return originalWaitForTransaction(txHash, retryInterval || 1000)
}
exports.invalidProvider = new starknet_1.SequencerProvider({ baseUrl: 'http://localhost:100' })
exports.deventAccounts = exports.DEVNET_ACCOUNTS.map(
  ({ address, secret }) =>
    new starknet_1.Account(exports.devnetProvider, address, starknet_1.ec.getKeyPair(secret))
)
function mockedConnector(setup) {
  const mock = new moq_ts_1.Mock()
  setup(mock)
  return mock.object()
}
exports.mockedConnector = mockedConnector
exports.connectors = exports.deventAccounts.map((account, index) =>
  mockedConnector((mock) => {
    mock
      .setup((conn) => conn.connect())
      .returnsAsync(account)
      .setup((conn) => conn.available())
      .returns(index > 1)
      .setup((conn) => conn.account())
      .returnsAsync(account)
  })
)
function compileContract(name) {
  return JSON.parse(
    fs_1.default.readFileSync(`${__dirname}/contracts/${name}.json`).toString('ascii')
  )
}
exports.compiledErc20 = compileContract('erc20')
exports.compiledDapp = compileContract('dapp')
//# sourceMappingURL=devnet.js.map
