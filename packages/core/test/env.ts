import type { EnvironmentContext } from '@jest/environment'
import type { JestEnvironmentConfig } from '@jest/environment'
import JSDOMEnvironment from 'jest-environment-jsdom'

export default class CustomJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context)
  }

  async setup(): Promise<void> {
    await super.setup()
    if (typeof this.global.TextEncoder === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { TextDecoder, TextEncoder } = require('util')
      this.global.TextEncoder = TextEncoder
      this.global.TextDecoder = TextDecoder
      this.global.ArrayBuffer = ArrayBuffer
      this.global.Uint8Array = Uint8Array
      this.global.Uint16Array = Uint16Array
      this.global.Uint32Array = Uint32Array
    }
  }
}
