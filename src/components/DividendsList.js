import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DividendsList({ dividends }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Dividendos</Text>
      {dividends?.map((item, index) => (
        <View
          key={`dividend-${item.paymentDate}-${index}`}
          style={styles.dividendItem}
        >
          <Text style={styles.itemTitle}>
            Data de Pagamento: {new Date(item.paymentDate).toLocaleDateString()}
          </Text>
          <Text>Valor: R$ {item.rate?.toFixed(2)}</Text>
          <Text>Referente a: {item.relatedTo}</Text>
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
  dividendItem: {
    padding: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
});
