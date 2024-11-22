import axios from "axios";
import * as AuthSession from "expo-auth-session";

const API_URL = "https://api-auth-ws.onrender.com/api/auth";

export const register = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Erro ao registrar");
    }
    throw new Error("Erro de conexão com o servidor");
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erro de conexão com o servidor");
  }
};

export const githubLogin = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
    });

    const authUrl = `${API_URL}/github`;

    const result = await AuthSession.startAsync({
      authUrl,
      returnUrl: redirectUri,
    });

    if (result.type === "success" && result.params.code) {
      // Trocar o código pelo token
      const response = await axios.get(`${API_URL}/github/callback`, {
        params: { code: result.params.code },
      });
      return response.data; // Contém o token
    } else {
      throw new Error("Autenticação cancelada");
    }
  } catch (error) {
    throw error;
  }
};
