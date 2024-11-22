import React from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function StockChart({ historicalData }) {
  const screenWidth = Dimensions.get("window").width - 40;

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
      close: Number(item.close),
      high: Number(item.high),
      low: Number(item.low),
    }))
    .filter(
      (item) =>
        item.date instanceof Date &&
        !isNaN(item.date) &&
        !isNaN(item.close) &&
        !isNaN(item.high) &&
        !isNaN(item.low)
    )
    .sort((a, b) => a.date - b.date);

  if (validData.length < 2) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Dados insuficientes para exibir o gráfico
        </Text>
      </View>
    );
  }

  const chartData = {
    labels: validData.map((item) =>
      item.date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    datasets: [
      {
        data: validData.map((item) => item.close),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const minY = Math.min(...validData.map((item) => item.low));
  const maxY = Math.max(...validData.map((item) => item.high));
  const yAxisRange = maxY - minY;

  return (
    <LineChart
      data={chartData}
      width={screenWidth}
      height={220}
      yAxisLabel="R$ "
      chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: {
          r: "3",
          strokeWidth: "1",
          stroke: "#007AFF",
        },
        propsForLabels: {
          fontSize: 10,
          rotation: 45,
        },
      }}
      withVerticalLines={false}
      withHorizontalLines={true}
      withDots={true}
      withShadow={false}
      bezier
      style={styles.chart}
      fromZero={false}
      yMin={minY - yAxisRange * 0.05}
      yMax={maxY + yAxisRange * 0.05}
    />
  );
}

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
