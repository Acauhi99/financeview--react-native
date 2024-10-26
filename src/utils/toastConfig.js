import { View } from "react-native";
import { Text } from "react-native-paper";

export const toastConfig = {
  error: ({ text1, text2 }) => (
    <View
      style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#FF3B30",
        width: "90%",
        alignSelf: "center",
        marginTop: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}>
        {text1}
      </Text>
      {text2 ? (
        <Text style={{ fontSize: 16, color: "#FFFFFF", marginTop: 5 }}>
          {text2}
        </Text>
      ) : null}
    </View>
  ),
};
