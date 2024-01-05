import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  XStack,
  YStack,
} from "tamagui";
import { Link } from "expo-router";

export function HomeScreen() {
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4">
        <H1 ta="center">Starknet React Expo Demo.</H1>
        <Paragraph ta="center" fontSize="$5">
          Proving an easy way to communicate with your arcade account.
        </Paragraph>

        <Separator />
        <Paragraph ta="center">
          Made by{" "}
          <Anchor
            color="$color12"
            href="https://github.com/apibara/starknet-react/"
            target="_blank"
            fontSize="$5"
          >
            @apibara
          </Anchor>
          ,{" "}
          <Anchor
            color="$color12"
            href="https://github.com/apibara/starknet-react/"
            target="_blank"
            rel="noreferrer"
          >
            give it a ⭐️
          </Anchor>
        </Paragraph>
      </YStack>

      <XStack paddingTop="$5">
        <Link href="/screens/setup" asChild>
          <Button size="$5" bc="$orange10" color="white">
            Get Started
          </Button>
        </Link>
      </XStack>
    </YStack>
  );
}
