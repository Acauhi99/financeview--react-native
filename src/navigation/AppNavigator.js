import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../utils/authContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import PortfolioScreen from "../screens/PortfolioScreen";
import TransactionsScreen from "../screens/TransactionsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token === null ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          {/* <Stack.Screen name="Portfolio" component={PortfolioScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} /> */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
