import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PositionCard = ({ positions }) => {
  return (
    <View style={styles.positionsCard}>
      <Text style={styles.sectionTitle}>Posições</Text>
      {positions.length > 0 ? (
        positions.map((position, index) => (
          <View key={index} style={styles.positionItem}>
            <View style={styles.positionHeader}>
              <Text style={styles.tickerText}>{position.ticker}</Text>
              <Text style={styles.quantityText}>{position.quantity} ações</Text>
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
        <Text style={styles.emptyMessage}>Nenhuma posição encontrada</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
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

export default PositionCard;
