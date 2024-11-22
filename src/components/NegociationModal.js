import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";

export default function NegociationModal({
  visible,
  onClose,
  stock,
  onBuy,
  onSell,
  portfolio,
  isLoading,
}) {
  const [quantity, setQuantity] = useState("");
  const [transactionType, setTransactionType] = useState("BUY");

  const totalAmount = stock?.currentPrice * parseInt(quantity || 0);

  const handleTransaction = () => {
    if (!quantity) return;
    if (transactionType === "BUY") {
      onBuy(quantity);
    } else {
      onSell(quantity);
    }
  };

  const handleBackdropPress = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Negociação - {stock?.symbol}
              </Text>

              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    transactionType === "BUY" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setTransactionType("BUY")}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      transactionType === "BUY" &&
                        styles.toggleButtonTextActive,
                    ]}
                  >
                    Comprar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    transactionType === "SELL" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setTransactionType("SELL")}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      transactionType === "SELL" &&
                        styles.toggleButtonTextActive,
                    ]}
                  >
                    Vender
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.price}>
                Preço: R$ {stock?.currentPrice.toFixed(2)}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Quantidade"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                editable={!isLoading}
              />

              {quantity && (
                <Text style={styles.totalAmount}>
                  Total: R$ {totalAmount.toFixed(2)}
                </Text>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    transactionType === "SELL" && styles.sellButton,
                    !quantity && styles.disabledButton,
                  ]}
                  onPress={handleTransaction}
                  disabled={!quantity || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {transactionType === "BUY" ? "Comprar" : "Vender"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  toggleButtonActive: {
    backgroundColor: "#007AFF",
  },
  toggleButtonText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
  price: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  sellButton: {
    backgroundColor: "#F44336",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
