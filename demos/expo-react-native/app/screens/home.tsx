import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  XStack,
  YStack,
} from "tamagui";
import { useLink } from "solito/link";

export function HomeScreen() {
  const linkProps = useLink({
    href: "/screens/setup",
  });

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
            href="https://github.com/tamagui/tamagui"
            target="_blank"
            rel="noreferrer"
          >
            give it a ⭐️
          </Anchor>
        </Paragraph>
      </YStack>

      <XStack paddingTop="$5">
        <Button size="$5" bc="$orange10" color="white" {...linkProps}>
          Get Started
        </Button>
      </XStack>
    </YStack>
  );
}
