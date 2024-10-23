import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Text, TextInput } from "react-native-paper";
import { UserContext } from "../../context/UserContext";
import { RegisterSchema } from "../../validation";
import styles from "./Register.styles";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleRegister = (values) => {
    // Lógica de cadastro aqui
    setUser(values);
    console.log("First Name:", values.firstName);
    console.log("Last Name:", values.lastName);
    console.log("Email:", values.email);
    console.log("Date of Birth:", values.dob);
    console.log("Password:", values.password);
    console.log("Confirm Password:", values.confirmPassword);
    navigation.navigate("Dashboard");
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date, setFieldValue) => {
    setFieldValue("dob", date.toISOString().split("T")[0]);
    hideDatePicker();
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
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
          <View style={styles.input}>
            <TouchableOpacity onPress={showDatePicker}>
              <TextInput
                label="Date of Birth"
                value={values.dob}
                onChangeText={handleChange("dob")}
                onBlur={handleBlur("dob")}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
          </View>
          {errors.dob && touched.dob ? (
            <Text style={styles.error}>{errors.dob}</Text>
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
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Register
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default Register;
