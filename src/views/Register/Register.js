import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, ProgressBar, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { UserContext } from "../../context/UserContext";
import { AuthService } from "../../entities";
import { RegisterSchema } from "../../validation";
import styles from "./Register.styles";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);

    const user = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      birthDate: values.birthDate,
      password: values.password,
    };

    try {
      const registeredUser = await AuthService.register(user);
      setUser(registeredUser);
      navigation.navigate("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date, setFieldValue) => {
    setFieldValue("birthDate", date.toISOString().split("T")[0]);
    hideDatePicker();
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={handleRegister}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <TextInput
            label="First Name"
            value={values.firstName}
            onChangeText={handleChange("firstName")}
            onBlur={handleBlur("firstName")}
            style={styles.input}
          />
          {errors.firstName && touched.firstName ? (
            <Text style={styles.error}>{errors.firstName}</Text>
          ) : null}
          <TextInput
            label="Last Name"
            value={values.lastName}
            onChangeText={handleChange("lastName")}
            onBlur={handleBlur("lastName")}
            style={styles.input}
          />
          {errors.lastName && touched.lastName ? (
            <Text style={styles.error}>{errors.lastName}</Text>
          ) : null}
          <TextInput
            label="Email"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && touched.email ? (
            <Text style={styles.error}>{errors.email}</Text>
          ) : null}
          <TouchableOpacity onPress={showDatePicker} style={styles.input}>
            <TextInput
              label="Date of Birth"
              value={values.birthDate}
              onChangeText={handleChange("birthDate")}
              onBlur={handleBlur("birthDate")}
              editable={false}
              pointerEvents="none"
              style={styles.input}
            />
          </TouchableOpacity>
          {errors.birthDate && touched.birthDate ? (
            <Text style={styles.error}>{errors.birthDate}</Text>
          ) : null}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(date) => handleConfirm(date, setFieldValue)}
            onCancel={hideDatePicker}
          />
          <TextInput
            label="Password"
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            style={styles.input}
            secureTextEntry
          />
          {errors.password && touched.password ? (
            <Text style={styles.error}>{errors.password}</Text>
          ) : null}
          <TextInput
            label="Confirm Password"
            value={values.confirmPassword}
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            style={styles.input}
            secureTextEntry
          />
          {errors.confirmPassword && touched.confirmPassword ? (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          ) : null}
          {loading && (
            <ProgressBar
              progress={0.5}
              color="#6200ee"
              style={styles.progressBar}
            />
          )}
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Register
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default Register;
