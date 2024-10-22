import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  Dashboard,
  Login,
  Portfolio,
  Profile,
  Register,
  Transactions,
  Wellcome,
} from "../views";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Wellcome">
      <Stack.Screen name="Wellcome" component={Wellcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Portfolio" component={Portfolio} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
