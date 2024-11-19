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
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateFields = async () => {
    return loginSchema
      .validate(user, { abortEarly: false })
      .then(() => {
        setErrors({});
        return true;
      })
      .catch((validationErrors) => {
        const formattedErrors = {};
        validationErrors.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        setErrors(formattedErrors);
        return false;
      });
  };

  const handleLogin = () => {
    setApiError("");

    validateFields().then((isValid) => {
      if (!isValid) {
        return;
      }

      setIsLoading(true);
      login(user.email, user.password)
        .then((data) => {
          const token = data.token;
          AsyncStorage.setItem("token", token).then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Dashboard" }],
            });
          });
        })
        .catch((error) => {
          setApiError(error.message || "Erro ao fazer login.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  const handleGithubLogin = () => {
    setApiError("");
    setIsLoading(true);

    githubLogin()
      .then((data) => {
        const token = data.token;
        AsyncStorage.setItem("token", token).then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          });
        });
      })
      .catch((error) => {
        setApiError(error.message || "Erro ao fazer login com GitHub.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={user.password}
        onChangeText={(text) => handleChange("password", text)}
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
