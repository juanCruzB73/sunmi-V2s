import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type LoginButtonProps = {
  onPress: () => void;
  label: string;
};

const LoginButton: React.FC<LoginButtonProps> = ({ onPress, label }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LoginButton;