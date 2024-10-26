import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Toast from "react-native-toast-message";
import StackNavigator from "./src/components/StackNavigator";
import { UserProvider } from "./src/context/UserContext";
import { toastConfig } from "./src/utils";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StackNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </UserProvider>
  );
}
