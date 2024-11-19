import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { login, githubLogin } from "../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de email inválido")
    .required("Email é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const validateFields = async () => {
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleLogin = async () => {
    setApiError("");

    const isValid = await validateFields();
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await login(email, password);
      const token = data.token;
      await AsyncStorage.setItem("token", token);
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
    } catch (error) {
      setApiError(error.message || "Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setApiError("");
    setIsLoading(true);
    try {
      const data = await githubLogin();
      const token = data.token;
      await AsyncStorage.setItem("token", token);
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
    } catch (error) {
      setApiError(error.message || "Erro ao fazer login com GitHub.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password ? (
        <Text style={styles.error}>{errors.password}</Text>
      ) : null}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
          <Button title="Entrar" onPress={handleLogin} />

          <TouchableOpacity
            style={styles.githubButton}
            onPress={handleGithubLogin}
          >
            <Text style={styles.githubButtonText}>Entrar com GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>
              Não tem uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
    marginLeft: 5,
  },
  apiError: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  githubButton: {
    backgroundColor: "#24292e",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  githubButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
  loader: {
    marginTop: 10,
  },
});
