import React from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function StockChart({ historicalData }) {
  const screenWidth = Dimensions.get("window").width - 65;

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
    .sort((a, b) => a.date - b.date)
    .slice(-30);

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
    labels: validData.map((item, index) =>
      index % 5 === 0 ? item.date.getDate().toString().padStart(2, "0") : ""
    ),
    datasets: [
      {
        data: validData.map((item) => item.close),
        color: () => "#0047AB",
        strokeWidth: 3,
      },
    ],
  };

  const minY = Math.min(...validData.map((item) => item.low));
  const maxY = Math.max(...validData.map((item) => item.high));
  const yAxisRange = maxY - minY;

  return (
    <View style={styles.chartContainer}>
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
          color: () => `rgb(0, 84, 227)`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          fillShadowGradient: "rgb(0, 84, 227)",
          fillShadowGradientOpacity: 0.6,
          strokeWidth: 3,
          propsForDots: {
            r: "0",
            strokeWidth: "0",
          },
          propsForLabels: {
            fontSize: 12,
            rotation: 0,
          },
          style: {
            borderRadius: 16,
          },
        }}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={false}
        withShadow={false}
        bezier
        style={styles.chart}
        fromZero={false}
        yMin={minY - yAxisRange * 0.05}
        yMax={maxY + yAxisRange * 0.05}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    paddingRight: 10,
  },
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
