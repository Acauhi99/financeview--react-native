import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HistoricalDataList({ historicalData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const totalPages = Math.ceil(validData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = validData.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Dados Históricos</Text>
      {paginatedData.map((item, index) => (
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

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
        >
          <Text style={styles.paginationButtonText}>Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.paginationInfo}>
          Página {currentPage} de {totalPages}
        </Text>

        <TouchableOpacity
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
        >
          <Text style={styles.paginationButtonText}>Próxima</Text>
        </TouchableOpacity>
      </View>
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 8,
  },
  paginationButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
  },
  paginationButtonDisabled: {
    backgroundColor: "#ccc",
  },
  paginationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  paginationInfo: {
    fontSize: 14,
    color: "#666",
  },
});
