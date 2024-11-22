import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const TransactionItem = ({ item }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case "BUY":
        return "#4CAF50";
      case "SELL":
        return "#F44336";
      case "DEPOSIT":
        return "#2196F3";
      case "WITHDRAWAL":
        return "#FF9800";
      default:
        return "#757575";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTransaction = (item) => {
    switch (item.type) {
      case "BUY":
        return `Compra de ${item.quantity} ${item.ticker}`;
      case "SELL":
        return `Venda de ${item.quantity} ${item.ticker}`;
      case "DEPOSIT":
        return "Depósito";
      case "WITHDRAWAL":
        return "Saque";
      default:
        return item.type;
    }
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.leftContent}>
        <Text style={[styles.type, { color: getTypeColor(item.type) }]}>
          {formatTransaction(item)}
        </Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      <Text style={[styles.amount, { color: getTypeColor(item.type) }]}>
        R$ {item.amount.toFixed(2)}
      </Text>
    </View>
  );
};

export default function TransactionHistoryList({ transactions }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Transações</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftContent: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
