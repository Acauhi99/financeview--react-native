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
import { register } from "../services/auth";
import * as yup from "yup";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Nome é obrigatório"),
  lastName: yup.string().required("Sobrenome é obrigatório"),
  email: yup
    .string()
    .email("Formato de email inválido")
    .required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

export default function RegisterScreen({ navigation }) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const validateFields = async () => {
    try {
      await registerSchema.validate(user, { abortEarly: false });
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

  const handleRegister = async () => {
    try {
      setApiError("");
      setSuccessMessage("");
      const isValid = await validateFields();
      if (!isValid) return;

      setIsLoading(true);
      const data = await register(
        user.firstName,
        user.lastName,
        user.email,
        user.password
      );
      setSuccessMessage(data.message || "Registro bem-sucedido!");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 500);
    } catch (error) {
      const errorMessage = error.message || "Erro ao registrar";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar-se</Text>

      {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}
      {successMessage ? (
        <Text style={styles.success}>{successMessage}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={user.firstName}
        onChangeText={(text) => handleChange("firstName", text)}
        autoCapitalize="words"
      />
      {errors.firstName ? (
        <Text style={styles.error}>{errors.firstName}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        value={user.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
        autoCapitalize="words"
      />
      {errors.lastName ? (
        <Text style={styles.error}>{errors.lastName}</Text>
      ) : null}

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
          <Button title="Cadastrar" onPress={handleRegister} />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>Já tem uma conta? Entre</Text>
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
  success: {
    color: "green",
    marginBottom: 20,
    textAlign: "center",
  },
  loader: {
    marginTop: 10,
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
});
