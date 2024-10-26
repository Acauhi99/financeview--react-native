import axios from "axios";

class AuthService {
  static baseURL = "https://finance-tracker-ws.onrender.com/api/auth";

  static async login(email, password) {
    try {
      const response = await axios.post(`${this.baseURL}/login`, {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  }

  static async register(user) {
    try {
      const response = await axios.post(`${this.baseURL}/register`, user);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  }
}

export default AuthService;
