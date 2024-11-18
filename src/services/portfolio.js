import axios from "axios";

const API_URL = "https://api-auth-ws.onrender.com/api/portfolio";

export const createPortfolio = async (token) => {
  try {
    const response = await axios.post(
      API_URL,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPortfolio = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPositions = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/positions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPerformance = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/performance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
