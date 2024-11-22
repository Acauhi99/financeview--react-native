import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HistoricalDataList({ historicalData }) {
  if (!Array.isArray(historicalData) || historicalData.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Dados históricos indisponíveis</Text>
      </View>
    );
  }

  const validData = historicalData
    .map((item) => ({
      date: new Date(item.date),
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
      volume: Number(item.volume),
    }))
    .filter(
      (item) =>
        item.date instanceof Date &&
        !isNaN(item.date) &&
        !isNaN(item.open) &&
        !isNaN(item.high) &&
        !isNaN(item.low) &&
        !isNaN(item.close) &&
        !isNaN(item.volume)
    )
    .sort((a, b) => b.date - a.date);

  if (validData.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Dados históricos inválidos</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Dados Históricos</Text>
      {validData.map((item, index) => (
        <View
          key={`historical-${item.date.getTime()}-${index}`}
          style={styles.historicalItem}
        >
          <Text style={styles.itemTitle}>
            Data: {item.date.toLocaleDateString("pt-BR")}
          </Text>
          <View style={styles.priceRow}>
            <Text>Abertura: R$ {item.open.toFixed(2)}</Text>
            <Text>Fechamento: R$ {item.close.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text>Máxima: R$ {item.high.toFixed(2)}</Text>
            <Text>Mínima: R$ {item.low.toFixed(2)}</Text>
          </View>
          <Text style={styles.volume}>
            Volume: {item.volume.toLocaleString("pt-BR")}
          </Text>
          <Text
            style={[
              styles.variation,
              { color: item.close >= item.open ? "#00cc00" : "#ff0000" },
            ]}
          >
            Variação:{" "}
            {(((item.close - item.open) / item.open) * 100).toFixed(2)}%
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  historicalItem: {
    padding: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  volume: {
    marginTop: 4,
    color: "#666",
  },
  variation: {
    marginTop: 4,
    fontWeight: "500",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  errorText: {
    color: "#666",
    fontSize: 16,
  },
});
