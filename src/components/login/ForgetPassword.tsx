import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type ForgotPasswordLinkProps = {
  onPress: () => void;
};

const ForgetPassword: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  link: {
    color: '#007bff',
    textAlign: 'right',
    marginBottom: 24,
  },
});

export default ForgetPassword;