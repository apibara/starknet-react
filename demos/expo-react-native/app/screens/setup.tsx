import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button, Text, View, Clipboard, TouchableOpacity } from "react-native";
import { truncateAddress } from "../../utils/functions";
import { setup_styles } from "../styles/styles";
import { Platform, ToastAndroid, Alert } from "react-native";

export default function SetupScreen({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  navigation.setOptions({
    headerBackTitleVisible: false,
    headerTintColor: "#008080",
  });

  return (
    <View style={setup_styles.container}>
      <Text style={setup_styles.title}>Setup New Account</Text>
      <Text style={setup_styles.address}>
        {truncateAddress(
          "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        )}
      </Text>
      <Text style={setup_styles.instruction}>
        Visit the page following page with a web browser to setup your account
      </Text>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          Clipboard.setString("https://account.starknet-react.com");
          if (Platform.OS === "android") {
            ToastAndroid.show("Url copied!!!", ToastAndroid.SHORT);
          } else if (Platform.OS === "ios") {
            Alert.alert("Url copied!!!");
          }
        }}
      >
        <View style={setup_styles.urlBox}>
          <Text style={setup_styles.url}>
            https://account.starknet-react.com
          </Text>
        </View>
      </TouchableOpacity>
      <View style={setup_styles.buttonContainer}>
        <Button title="Done" color="#ffffff" />
      </View>
    </View>
  );
}
