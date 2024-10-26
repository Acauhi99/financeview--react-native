import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, ProgressBar, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import { UserContext } from "../../context/UserContext";
import { AuthService } from "../../entities";
import { LoginSchema } from "../../validation";
import styles from "./Login.styles";

const Login = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const user = await AuthService.login(values.email, values.password);
      setUser(user);
      navigation.navigate("Dashboard");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.message,
      });
    }
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
          {loading && (
            <ProgressBar
              progress={0.5}
              color="#6200ee"
              style={styles.progressBar}
            />
          )}

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Criar Conta</Text>
          </TouchableOpacity>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Login
          </Button>
          <Button
            mode="outlined"
            icon={() => <Icon name="github" size={20} />}
            onPress={() => console.log("Logar com GitHub")}
            style={styles.githubButton}
          >
            Logar com GitHub
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default Login;
