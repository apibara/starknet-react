import { AccountInterface } from 'starknet'

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

  /** Whether connector is usable */
  static ready(): boolean {
    return false
  }

  abstract connect(): Promise<AccountInterface>
  abstract account(): Promise<AccountInterface>
}
