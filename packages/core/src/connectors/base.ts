import { AccountInterface } from 'starknet'

export abstract class Connector<Options = any> {
  /** Unique connector id */
  abstract id: string
  /** Connector name */
  abstract name: string
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
  abstract account(): Promise<AccountInterface>
}
