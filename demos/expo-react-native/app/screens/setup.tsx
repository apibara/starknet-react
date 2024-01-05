import { H2, Button, Paragraph, YStack } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, Link } from "expo-router";
import { Linking } from "react-native";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Setup New Account",
        }}
      />
      <SetupScreen />
    </>
  );
}

const handleOpenURL = () => {
  Linking.openURL("https://account.starknet-react.com");
};

export function SetupScreen() {
  return (
    <YStack f={1} jc="center" ai="center" space>
      <YStack space="$4" p="$9">
        <H2 ta="center">Setup New Account</H2>
        <Button
          backgroundColor="$yellow5Light"
          color="$orange10Dark"
          variant="outlined"
          fontSize="$5"
          onPress={handleOpenURL}
        >
          account.starknet-react.com
        </Button>
        <Paragraph ta="center" fontSize="$5">
          Visit the page following page with a web browser to setup your
          account.
        </Paragraph>
        <Button size="$4" bc="$orange10" fontSize="$5" color="white">
          Done
        </Button>
      </YStack>
      <Link href="/" asChild>
        <Button icon={ChevronLeft}>Go Home</Button>
      </Link>
    </YStack>
  );
}
