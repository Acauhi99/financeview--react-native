import axios from "axios";

class AuthService {
  static baseURL = "http://localhost:3000/api/auth";

  static async login(email, password) {
    try {
      const response = await axios.post(`${this.baseURL}/login`, {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  }

  static async register(user) {
    try {
      const response = await axios.post(`${this.baseURL}/register`, user);

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao registrar usuário"
      );
    }
  }
}

export default AuthService;
