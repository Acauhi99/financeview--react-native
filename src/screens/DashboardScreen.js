import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getStockDetails, getAvailableStocks } from "../services/stock";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import StockChart from "../components/StockChart";
import HistoricalDataList from "../components/HistoricalDataList";
import DividendsList from "../components/DividendsList";

export default function DashboardScreen() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSearch = async (stockQuery) => {
    if (!stockQuery?.trim()) {
      setApiError("Digite um ativo para buscar");
      return;
    }

    setIsLoading(true);
    setApiError("");
    setSelectedStock(null);

    try {
      const details = await getStockDetails(stockQuery.toUpperCase());
      if (details) {
        setSelectedStock(details);
        setApiError("");
      } else {
        setApiError(`Nenhum dado encontrado para ${stockQuery}`);
      }
    } catch (error) {
      setApiError(error.message);
      setSelectedStock(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStockDetails = () => {
    if (!selectedStock) return null;

    return (
      <ScrollView style={styles.detailsContainer}>
        <View style={styles.headerInfo}>
          <Text style={styles.stockSymbol}>{selectedStock.symbol}</Text>
          <Text style={styles.stockName}>{selectedStock.shortName}</Text>
          <Text style={styles.currentPrice}>
            Preço Atual: R$ {selectedStock.currentPrice?.toFixed(2)}
          </Text>
          <View style={styles.variationContainer}>
            <Text
              style={[
                styles.priceChange,
                {
                  color: selectedStock.priceChange >= 0 ? "#00cc00" : "#ff0000",
                },
              ]}
            >
              Variação: R$ {selectedStock.priceChange?.toFixed(2)} (
              {selectedStock.priceChangePercent?.toFixed(2)}%)
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Gráfico de Preços</Text>
        <StockChart historicalData={selectedStock.historicalData} />

        <HistoricalDataList historicalData={selectedStock.historicalData} />
        <DividendsList dividends={selectedStock.dividends} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscador de Ativos</Text>
        <SearchBar
          onSelectStock={handleSearch}
          isLoading={isLoading}
          fetchAvailableStocks={getAvailableStocks}
        />
        {isLoading && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#007AFF"
          />
        )}
        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}
        {renderStockDetails()}
      </View>
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
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
  detailsContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
  },
  headerInfo: {
    marginBottom: 20,
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: "bold",
  },
  stockName: {
    fontSize: 18,
    color: "#666",
  },
  currentPrice: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: "500",
  },
  variationContainer: {
    marginTop: 5,
  },
  priceChange: {
    fontSize: 18,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
