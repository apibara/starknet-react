import { TamaguiProvider, Theme, View } from '@tamagui/core';
import { Slot } from "expo-router";
import { useFonts } from 'expo-font';

import config from '../tamagui.config';

export default function Layout() {
  useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  return (
    <TamaguiProvider config={config}>
      <Theme name="light_orange">
        <Slot />
      </Theme>
    </TamaguiProvider>
  );
}
