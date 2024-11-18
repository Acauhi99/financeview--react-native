import axios from "axios";

const API_URL = "https://api-auth-ws.onrender.com/api/transaction";

export const getTransactionHistory = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const buyStock = async (
  ticker,
  quantity,
  amount,
  portfolioId,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/stock/buy`,
      {
        ticker,
        quantity,
        amount,
        portfolioId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const sellStock = async (
  ticker,
  quantity,
  amount,
  portfolioId,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/stock/sell`,
      {
        ticker,
        quantity,
        amount,
        portfolioId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const depositFunds = async (amount, portfolioId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/deposit`,
      {
        amount,
        portfolioId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const withdrawFunds = async (amount, portfolioId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/withdraw`,
      {
        amount,
        portfolioId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
