import axios from "axios";

const API_URL = "https://api-auth-ws.onrender.com/api/stock";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const getAvailableStocks = async (search) => {
  try {
    const response = await api.get("/market/available", {
      params: { search },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Nenhum ativo encontrado");
      }
      if (error.response.status === 500) {
        throw new Error("Erro no servidor. Tente novamente mais tarde");
      }
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Erro ao buscar ativos disponíveis";
      throw new Error(message);
    }

    if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão");
    }

    throw new Error("Erro ao buscar ativos disponíveis");
  }
};

export const getStockDetails = async (ticker) => {
  try {
    const response = await api.get(`/market/${ticker}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error(`Ativo ${ticker} não encontrado`);
      }
      if (error.response.status === 500) {
        throw new Error("Erro no servidor. Tente novamente mais tarde");
      }
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Erro ao buscar dados do ativo";
      throw new Error(message);
    }

    if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão");
    }

    throw new Error("Erro ao buscar dados do ativo");
  }
};
