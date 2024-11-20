import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getStockDetails } from "../services/stock";

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSearch = async () => {
    const query = searchQuery.trim().toUpperCase();

    if (!query) {
      setApiError("Digite um ativo para buscar");
      return;
    }

    setIsLoading(true);
    setApiError("");
    setSelectedStock(null);

    try {
      const details = await getStockDetails(query);
      if (details) {
        setSelectedStock(details);
        setApiError("");
      } else {
        setApiError("Nenhum dado encontrado para " + query);
      }
    } catch (error) {
      setApiError(error.message);
      setSelectedStock(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ativo (ex: PETR4)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[
            styles.searchButton,
            (!searchQuery.trim() || isLoading) && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
        >
          <Text style={styles.searchButtonText}>
            {isLoading ? "Buscando..." : "Buscar"}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      )}

      {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

      {selectedStock && (
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
          {selectedStock.historicalData?.map((item, index) => (
            <View
              key={`historical-${item.date}-${index}`}
              style={styles.historicalItem}
            >
              <Text style={styles.itemTitle}>
                Data: {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text>Abertura: R$ {item.open?.toFixed(2)}</Text>
              <Text>Máxima: R$ {item.high?.toFixed(2)}</Text>
              <Text>Mínima: R$ {item.low?.toFixed(2)}</Text>
              <Text>Fechamento: R$ {item.close?.toFixed(2)}</Text>
              <Text>Volume: {item.volume?.toLocaleString()}</Text>
            </View>
          ))}

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
              <Text>Taxa: R$ {item.rate?.toFixed(2)}</Text>
              <Text>Tipo: {item.type}</Text>
              <Text>Referente a: {item.relatedTo}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    height: 50,
    width: 100,
  },
  searchButtonDisabled: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  stockItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 8,
  },
  stockText: {
    fontSize: 18,
    fontWeight: "500",
  },
  stockPrice: {
    fontSize: 18,
    color: "#00cc00",
    fontWeight: "500",
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
});
