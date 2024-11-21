import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

export default function SearchBar({
  onSelectStock,
  isLoading,
  fetchAvailableStocks,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableStocks, setAvailableStocks] = useState([]);

  const handleFetchStocks = async () => {
    try {
      const response = await fetchAvailableStocks();
      if (response && response.stocks) {
        setAvailableStocks(response.stocks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredStocks = availableStocks.filter((stock) =>
    stock.symbol.includes(searchQuery.toUpperCase())
  );

  const handleStockSelect = (symbol) => {
    setSearchQuery(symbol);
    setShowDropdown(false);
    onSelectStock(symbol);
  };

  return (
    <View style={styles.searchSection}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ativo (ex: PETR4)"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setShowDropdown(true);
            handleFetchStocks();
          }}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[
            styles.searchButton,
            (!searchQuery.trim() || isLoading) && styles.searchButtonDisabled,
          ]}
          onPress={() => handleStockSelect(searchQuery)}
          disabled={isLoading || !searchQuery.trim()}
        >
          <Text style={styles.searchButtonText}>
            {isLoading ? "Buscando..." : "Buscar"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredStocks}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleStockSelect(item.symbol)}
              >
                <Text style={styles.dropdownSymbol}>{item.symbol}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown}
            nestedScrollEnabled={true}
            maxHeight={200}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    zIndex: 1,
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
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownSymbol: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownName: {
    fontSize: 14,
    color: "#666",
  },
});
