import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000000",
  },
  input: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  button: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#000000",
    color: "#FFFFFF",
  },
  error: {
    color: "#FF0000",
  },
});

export default styles;
