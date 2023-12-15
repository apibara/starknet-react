import { View, Image, Text, Button } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React from "react";
import { welcome_styles } from "../styles/styles";

export default function Welcome({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  navigation.setOptions({
    headerShown: false,
  });

  const navigateToSetup = () => {
    navigation.navigate("Setup new account");
  };

  return (
    <View style={welcome_styles.container}>
      <View style={welcome_styles.container_1}>
        <Text style={welcome_styles.h4}>Starknet React</Text>
      </View>
      <View style={welcome_styles.container_1}>
        <Image
          source={require("../../assets/adaptive-icon.png")}
          style={welcome_styles.image}
        />
      </View>
      <View style={welcome_styles.container_2}>
        <Text style={{ textAlign: "center" }}> 
          <Text style={welcome_styles.welcome}>Starknet React </Text>
          <Text style={welcome_styles.app_name}>Expo Demo</Text>
        </Text>
      </View>
      <View style={welcome_styles.container_3}>
        <Text style={welcome_styles.description}>
          Providing an easy way to communicate with your arcade account
        </Text>
      </View>
      <View style={welcome_styles.button_container}>
        <Button title="Get Started" onPress={navigateToSetup} color="#ffffff" />
      </View>
    </View>
  );
}
