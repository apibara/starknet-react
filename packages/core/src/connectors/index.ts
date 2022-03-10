import { SignerInterface } from 'starknet'

export abstract class Connector {
  /** Unique connector id */
  abstract readonly id: string
  /** Connector name */
  abstract readonly name: string
  /** Whether connector is usable */
  abstract readonly ready: boolean

  abstract connect(): Promise<SignerInterface | undefined>
}

export { InjectedConnector } from './injected'
