import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PerformanceCard = ({ performance }) => {
  return (
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
              {isNaN(parseFloat(performance.profitability))
                ? "0.00%"
                : `${parseFloat(performance.profitability).toFixed(2)}%`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default PerformanceCard;
