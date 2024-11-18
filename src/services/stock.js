import axios from "axios";

const API_URL = "https://api-auth-ws.onrender.com/api/stock";

export const getAvailableStocks = async (search) => {
  try {
    const response = await axios.get(`${API_URL}/market/available`, {
      params: { search },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStockDetails = async (ticker) => {
  try {
    const response = await axios.get(`${API_URL}/market/${ticker}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
