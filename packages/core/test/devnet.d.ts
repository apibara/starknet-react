import { Mock } from 'moq.ts'
import { Account, SequencerProvider, CompiledContract } from 'starknet'
import { Connector } from '~/connectors'
export declare const DEVNET_ACCOUNTS: {
  address: string
  secret: string
}[]
export declare const devnetProvider: SequencerProvider
export declare const invalidProvider: SequencerProvider
export declare const deventAccounts: Account[]
export declare function mockedConnector(setup: (mock: Mock<Connector>) => void): Connector
export declare const connectors: Connector<any>[]
export declare const compiledErc20: CompiledContract
export declare const compiledDapp: CompiledContract
