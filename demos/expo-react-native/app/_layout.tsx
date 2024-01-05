import { TamaguiProvider, Theme, View } from '@tamagui/core';
import { SplashScreen, Slot } from "expo-router";
import { useEffect, useState } from "react";
import * as Fonts from "expo-font";

import config from '../tamagui.config';

export default function Layout() {
  const [{ loaded: fontsLoaded, error: fontError }, setFontState] = useState({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    Fonts.loadAsync({
      Inter: require("../assets/fonts/Inter-Medium.ttf"),
      InterBold: require("../assets/fonts/Inter-Bold.ttf"),
    })
      .then(() => {
        setFontState({ loaded: true, error: false });
      })
      .catch((err) => {
        console.error(err);
        setFontState({ loaded: false, error: true });
      });
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded) {
    return null;
  }

  if (fontError) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name="light_orange">
        <Slot />
      </Theme>
    </TamaguiProvider>
  );
}
