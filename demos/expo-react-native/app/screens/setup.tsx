import { H2, Button, Paragraph, YStack } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { useLink } from "solito/link";
import { Stack } from "expo-router";

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

export function SetupScreen() {
  const link = useLink({
    href: "/",
  });

  return (
    <YStack f={1} jc="flex-start" ai="center" space>
      <YStack space="$4" bc="$background" p="$12">
        <H2 ta="center">Setup New Account</H2>
        <Button
          backgroundColor="$yellow5Light"
          color="$orange10Dark"
          variant="outlined"
        >
          account.starknet-react.com
        </Button>
        <Paragraph ta="center">
          Visit the page following page with a web browser to setup your
          account.
        </Paragraph>
        <Button size="$4" backgroundColor="$green5Dark" color="white">
          Done
        </Button>
      </YStack>
      <Button {...link} icon={ChevronLeft}>
        Go Home
      </Button>
    </YStack>
  );
}
