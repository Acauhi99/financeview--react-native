import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { UserContext } from "../../context/UserContext";
import { LoginSchema } from "../../validation";
import styles from "./Login.styles";

const Login = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);

  const handleLogin = (values) => {
    // Lógica de login aqui
    console.log("Email:", values.email);
    console.log("Password:", values.password);
    setUser(values);
    navigation.navigate("Dashboard");
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            label="Email"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && touched.email ? (
            <Text style={styles.error}>{errors.email}</Text>
          ) : null}
          <TextInput
            label="Password"
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            style={styles.input}
            secureTextEntry
          />
          {errors.password && touched.password ? (
            <Text style={styles.error}>{errors.password}</Text>
          ) : null}
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Criar Conta</Text>
          </TouchableOpacity>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Login
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default Login;
