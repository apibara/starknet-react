import { config } from '@tamagui/config/v2'
import { createTamagui } from 'tamagui'

const tamaguiConfig = createTamagui(config)

// this makes typescript properly type everything based on the config
type Conf = typeof tamaguiConfig
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
