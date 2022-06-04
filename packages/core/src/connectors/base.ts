import { AccountInterface } from 'starknet'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Connector<Options = any> {
  /** Unique connector id */
  abstract readonly id: string
  /** Connector name */
  abstract readonly name: string
  /** Options to use with connector */
  readonly options: Options

  constructor({ options }: { options: Options }) {
    this.options = options
  }

  /** Whether connector is available for use */
  abstract available(): boolean

  /** Whether connector is already authorized */
  abstract ready(): Promise<boolean>
  abstract connect(): Promise<AccountInterface>
  abstract disconnect(): Promise<void>
  abstract account(): Promise<AccountInterface>
}
