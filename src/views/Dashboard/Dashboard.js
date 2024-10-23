import React, { useContext } from "react";
import { Text, View } from "react-native";
import { UserContext } from "../../context/UserContext";
import styles from "./Dashboard.styles";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.firstName}!</Text>
    </View>
  );
};

export default Dashboard;
