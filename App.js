import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import StackNavigator from "./src/components/StackNavigator";
import { UserProvider } from "./src/context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StackNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </UserProvider>
  );
}
