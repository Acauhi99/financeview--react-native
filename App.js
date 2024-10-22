import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import StackNavigator from "./src/components/StackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
