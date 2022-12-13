import { AccountInterface } from 'starknet'
import { EventHandler } from './injected'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Connector<Options = any> {
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
  abstract initEventListener(accountChangeCb: EventHandler): Promise<void>
  abstract removeEventListener(accountChangeCb: EventHandler): Promise<void>
  abstract account(): Promise<AccountInterface | null>
  /** Unique connector id */
  abstract id(): string
  /** Connector name */
  abstract name(): string
}
