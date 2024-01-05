import { HomeScreen } from "./screens/home";
import { Stack } from "expo-router";

export default function App() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />
      <HomeScreen />
    </>
  );
}
