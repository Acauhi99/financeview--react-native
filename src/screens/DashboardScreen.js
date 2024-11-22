import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { getStockDetails, getAvailableStocks } from "../services/stock";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import { useScreenFocus } from "../utils/useScreenFocus";

export default function DashboardScreen() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useScreenFocus(() => {
    setSelectedStock(null);
    setApiError("");
  }, []);

  const handleSearch = async (stockQuery) => {
    if (!stockQuery) {
      setApiError("Digite um ativo para buscar");
      return;
    }

    setIsLoading(true);
    setApiError("");
    setSelectedStock(null);

    try {
      const details = await getStockDetails(stockQuery);
      if (details) {
        setSelectedStock(details);
        setApiError("");
      } else {
        setApiError("Nenhum dado encontrado para " + stockQuery);
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
      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.detailsContainer}>
            <View style={styles.headerInfo}>
              <Text style={styles.stockSymbol}>{selectedStock.symbol}</Text>
              <Text style={styles.stockName}>{selectedStock.shortName}</Text>
              <Text style={styles.currentPrice}>
                Preço Atual: R$ {selectedStock.currentPrice?.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.priceChange,
                  {
                    color:
                      selectedStock.priceChangePercent >= 0
                        ? "#00cc00"
                        : "#ff0000",
                  },
                ]}
              >
                Variação: {selectedStock.priceChangePercent?.toFixed(2)}%
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Dados Históricos</Text>
          </View>
        )}
        data={selectedStock.historicalData}
        renderItem={({ item }) => (
          <View style={styles.historicalItem}>
            <Text style={styles.itemTitle}>
              Data: {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text>Abertura: R$ {item.open?.toFixed(2)}</Text>
            <Text>Máxima: R$ {item.high?.toFixed(2)}</Text>
            <Text>Mínima: R$ {item.low?.toFixed(2)}</Text>
            <Text>Fechamento: R$ {item.close?.toFixed(2)}</Text>
            <Text>Volume: {item.volume?.toLocaleString()}</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View>
            <Text style={styles.sectionTitle}>Dividendos</Text>
            {selectedStock.dividends?.map((item, index) => (
              <View
                key={`dividend-${item.paymentDate}-${index}`}
                style={styles.dividendItem}
              >
                <Text style={styles.itemTitle}>
                  Data de Pagamento:{" "}
                  {new Date(item.paymentDate).toLocaleDateString()}
                </Text>
                <Text>Valor: R$ {item.rate?.toFixed(2)}</Text>
                <Text>Referente a: {item.relatedTo}</Text>
              </View>
            ))}
          </View>
        )}
      />
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
  priceChange: {
    fontSize: 18,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  historicalItem: {
    padding: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  dividendItem: {
    padding: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
});
