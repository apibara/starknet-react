import { Button, H1, SizableText, YStack } from "tamagui";

export default function App() {
  return (
    <YStack px="$4" py="$4" justifyContent="space-between" height="50%" my="auto">
      <YStack space="$4">
        <H1 textAlign="center">Welcome to the Starknet React PWA Demo</H1>
        <SizableText>
          You need to setup an account before you can use this app.
        </SizableText>
      </YStack>
      <Button>Setup Account</Button>
    </YStack>
  );
}
