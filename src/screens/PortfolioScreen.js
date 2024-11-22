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
import PerformanceCard from "../components/PerformanceCard";
import PositionCard from "../components/PositionCard";
import { useScreenFocus } from "../utils/useScreenFocus";

export default function PortfolioScreen() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [positions, setPositions] = useState([]);
  const [performance, setPerformance] = useState(null);

  useScreenFocus(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const portfolioData = await getPortfolio(token);
      setPortfolio(portfolioData);

      if (portfolioData) {
        const [positionsData, performanceData] = await Promise.all([
          getPositions(token),
          getPerformance(token),
        ]);
        setPositions(positionsData);
        setPerformance(performanceData);
      }
    } catch (err) {
      if (err.message !== "Portfolio not found") {
        setError(err.message || "Erro ao buscar dados");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreatePortfolio = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newPortfolio = await createPortfolio(token);
      setPortfolio(newPortfolio);
      await fetchData();
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

      await fetchData();
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
      <Text style={styles.title}>Meu Portfólio</Text>
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

            <PerformanceCard performance={performance} />
            <PositionCard positions={positions} />
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>Bem-vindo!</Text>
              <Text style={styles.emptyStateMessage}>
                Você ainda não possui um portfólio.{"\n"}
                Crie agora para começar a investir!
              </Text>
              <TouchableOpacity
                style={styles.createPortfolioButton}
                onPress={handleCreatePortfolio}
                disabled={isLoading}
              >
                <Text style={styles.createPortfolioButtonText}>
                  Criar Meu Primeiro Portfólio
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  portfolioCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },

  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },

  balanceText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 24,
    letterSpacing: -0.5,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    gap: 12,
  },

  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  depositButton: {
    backgroundColor: "#34C759",
  },

  withdrawButton: {
    backgroundColor: "#FF3B30",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },

  emptyStateCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  emptyStateTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },

  emptyStateMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },

  createPortfolioButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  createPortfolioButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
