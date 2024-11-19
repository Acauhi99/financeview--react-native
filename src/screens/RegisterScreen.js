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

// Definição do esquema de validação com Yup
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const validateFields = async () => {
    try {
      await registerSchema.validate(
        { firstName, lastName, email, password },
        { abortEarly: false }
      );
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
    setApiError("");
    setSuccessMessage("");

    const isValid = await validateFields();
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await register(firstName, lastName, email, password);
      setSuccessMessage(data.message || "Registro bem-sucedido!");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
    } catch (error) {
      setApiError(error.message || "Erro ao registrar.");
    } finally {
      setIsLoading(false);
    }
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
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      {errors.firstName ? (
        <Text style={styles.error}>{errors.firstName}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />
      {errors.lastName ? (
        <Text style={styles.error}>{errors.lastName}</Text>
      ) : null}

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
