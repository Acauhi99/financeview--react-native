import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Button, Text } from "react-native-paper";
import styles from "./Wellcome.styles";

const Wellcome = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.animatedView, opacity: fadeAnim }}>
        <Text style={styles.text}>Wellcome</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
        >
          Login
        </Button>
      </Animated.View>
    </View>
  );
};

export default Wellcome;
