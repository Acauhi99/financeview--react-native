import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../utils/authContext";
import SearchBar from "../components/SearchBar";
import NegociationModal from "../components/NegociationModal";
import TransactionHistoryList from "../components/TransactionHistoryList";
import { getStockDetails, getAvailableStocks } from "../services/stock";
import {
  buyStock,
  sellStock,
  getTransactionHistory,
} from "../services/transaction";
import { getPortfolio } from "../services/portfolio";
import { useScreenFocus } from "../utils/useScreenFocus";

export default function TransactionsScreen() {
  const { token } = useContext(AuthContext);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useScreenFocus(() => {
    fetchPortfolio();
    fetchTransactions();
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactionHistory(token);
      setTransactions(data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar histórico de transações");
    }
  };

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio(token);
      setPortfolio(data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar portfolio");
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, []);

  const handleStockSelect = async (ticker) => {
    setIsLoading(true);
    try {
      const stockData = await getStockDetails(ticker);
      setSelectedStock(stockData);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar dados da ação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionSuccess = () => {
    setModalVisible(false);
    setSelectedStock(null);
    fetchPortfolio();
    fetchTransactions();
  };

  const handleBuy = async (quantity) => {
    if (!selectedStock || !quantity || !portfolio) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const totalAmount = selectedStock.currentPrice * parseInt(quantity);

    if (totalAmount > portfolio.balance) {
      Alert.alert("Erro", "Saldo insuficiente");
      return;
    }

    try {
      setIsLoading(true);
      await buyStock(
        selectedStock.symbol,
        parseInt(quantity),
        totalAmount,
        portfolio.id,
        token
      );
      Alert.alert(
        "Sucesso",
        `Compra de ${quantity} ações de ${
          selectedStock.symbol
        } realizada com sucesso por R$ ${totalAmount.toFixed(2)}`,
        [{ text: "OK", onPress: handleTransactionSuccess }]
      );
    } catch (error) {
      Alert.alert(
        "Erro na Transação",
        error.message || "Não foi possível realizar a compra. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async (quantity) => {
    if (!selectedStock || !quantity || !portfolio) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const totalAmount = selectedStock.currentPrice * parseInt(quantity);

    try {
      setIsLoading(true);
      await sellStock(
        selectedStock.symbol,
        parseInt(quantity),
        totalAmount,
        portfolio.id,
        token
      );
      Alert.alert(
        "Sucesso",
        `Venda de ${quantity} ações de ${
          selectedStock.symbol
        } realizada com sucesso por R$ ${totalAmount.toFixed(2)}`,
        [{ text: "OK", onPress: handleTransactionSuccess }]
      );
    } catch (error) {
      Alert.alert(
        "Erro na Transação",
        error.message || "Não foi possível realizar a venda. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Negociação</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo Disponível</Text>
            <Text style={styles.balanceValue}>
              R$ {portfolio?.balance?.toFixed(2) || "0.00"}
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              onSelectStock={handleStockSelect}
              isLoading={isLoading}
              fetchAvailableStocks={getAvailableStocks}
            />
          </View>

          {selectedStock && (
            <View style={styles.stockInfo}>
              <Text style={styles.stockName}>{selectedStock.shortName}</Text>
              <Text style={styles.stockPrice}>
                Preço: R$ {selectedStock.currentPrice?.toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.tradeButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.tradeButtonText}>Negociar</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.transactionListContainer}>
            <TransactionHistoryList transactions={transactions} />
          </View>
        </View>

        <NegociationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          stock={selectedStock}
          onBuy={handleBuy}
          onSell={handleSell}
          portfolio={portfolio}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "android" ? 32 : 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  balanceCard: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E2E2E",
  },
  searchContainer: {
    marginBottom: 16,
    zIndex: 1,
  },
  stockInfo: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  stockName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2E2E2E",
  },
  stockPrice: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666",
  },
  tradeButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  tradeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionListContainer: {
    flex: 1,
  },
});
