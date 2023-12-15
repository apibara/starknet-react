import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "./screens/welcome";
import SetupScreen from "./screens/setup";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Setup new account" component={SetupScreen} />
    </Stack.Navigator>
  );
}
