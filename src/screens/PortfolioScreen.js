import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../utils/authContext";
import {
  createPortfolio,
  getPortfolio,
  getPositions,
  getPerformance,
} from "../services/portfolio";
import { depositFunds, withdrawFunds } from "../services/transaction";
import TransactionModal from "../components/TransactionModal";

export default function PortfolioScreen() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [positions, setPositions] = useState([]);
  const [performance, setPerformance] = useState(null);

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio(token);
      setPortfolio(data);
    } catch (err) {
      if (err.message !== "Portfolio not found") {
        setError(err.message || "Erro ao buscar portfolio");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const data = await getPositions(token);
      setPositions(data);
    } catch (err) {
      console.error("Error fetching positions:", err);
    }
  };

  const fetchPerformance = async () => {
    try {
      const data = await getPerformance(token);
      setPerformance(data);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPortfolio();
      if (portfolio) {
        await Promise.all([fetchPositions(), fetchPerformance()]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleCreatePortfolio = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newPortfolio = await createPortfolio(token);
      setPortfolio(newPortfolio);
    } catch (err) {
      setError(err.message || "Erro ao criar portfolio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransaction = async (amount) => {
    try {
      setIsLoading(true);
      setError(null);

      if (transactionType === "deposit") {
        await depositFunds(amount, portfolio.id, token);
      } else {
        await withdrawFunds(amount, portfolio.id, token);
      }

      // Refresh all data
      const [portfolioData, positionsData, performanceData] = await Promise.all(
        [getPortfolio(token), getPositions(token), getPerformance(token)]
      );

      setPortfolio(portfolioData);
      setPositions(positionsData);
      setPerformance(performanceData);

      setModalVisible(false);
      Alert.alert("Sucesso", "Transação realizada com sucesso!");
    } catch (err) {
      setError(err.message || "Erro na transação");
      Alert.alert("Erro", err.message || "Erro na transação");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (type) => {
    setTransactionType(type);
    setModalVisible(true);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Portfolio</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {portfolio ? (
          <>
            <View style={styles.portfolioCard}>
              <Text style={styles.balanceLabel}>Saldo Disponível</Text>
              <Text style={styles.balanceText}>
                R$ {portfolio.balance.toFixed(2)}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.depositButton]}
                  onPress={() => openModal("deposit")}
                >
                  <Text style={styles.buttonText}>Depositar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.withdrawButton]}
                  onPress={() => openModal("withdraw")}
                >
                  <Text style={styles.buttonText}>Sacar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.performanceCard}>
              <Text style={styles.sectionTitle}>Performance</Text>
              {performance && (
                <View style={styles.performanceGrid}>
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Total Investido</Text>
                    <Text style={styles.performanceValue}>
                      R$ {parseFloat(performance.totalInvested).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Ganhos</Text>
                    <Text
                      style={[
                        styles.performanceValue,
                        {
                          color:
                            parseFloat(performance.totalGains) >= 0
                              ? "#4CAF50"
                              : "#F44336",
                        },
                      ]}
                    >
                      R$ {parseFloat(performance.totalGains).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Dividendos</Text>
                    <Text style={styles.performanceValue}>
                      R$ {parseFloat(performance.totalDividends).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Rentabilidade</Text>
                    <Text
                      style={[
                        styles.performanceValue,
                        {
                          color:
                            parseFloat(performance.profitability) >= 0
                              ? "#4CAF50"
                              : "#F44336",
                        },
                      ]}
                    >
                      {performance.profitability}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.positionsCard}>
              <Text style={styles.sectionTitle}>Posições</Text>
              {positions.length > 0 ? (
                positions.map((position, index) => (
                  <View key={index} style={styles.positionItem}>
                    <View style={styles.positionHeader}>
                      <Text style={styles.tickerText}>{position.ticker}</Text>
                      <Text style={styles.quantityText}>
                        {position.quantity} ações
                      </Text>
                    </View>
                    <View style={styles.positionDetails}>
                      <Text style={styles.priceText}>
                        Preço atual: R$ {position.currentPrice.toFixed(2)}
                      </Text>
                      <Text style={styles.totalText}>
                        Total: R$ {position.totalValue.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyMessage}>
                  Nenhuma posição encontrada
                </Text>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.message}>
              Parece que você ainda não tem um portfolio
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreatePortfolio}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Criar Portfolio</Text>
            </TouchableOpacity>
          </>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleTransaction}
        type={transactionType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 32,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 32,
  },
  portfolioCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E2E2E",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  depositButton: {
    backgroundColor: "#4CAF50",
  },
  withdrawButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  performanceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  performanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  performanceItem: {
    width: "48%",
    marginBottom: 16,
  },
  performanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  positionsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    marginTop: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  positionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  positionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tickerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    color: "#666",
  },
  positionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 14,
    color: "#666",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
  },
});
