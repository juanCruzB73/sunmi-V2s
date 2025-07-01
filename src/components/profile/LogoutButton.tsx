import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface LogoutButtonProps {
  onPress: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Salir</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 80,
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 25,
  },
});

export default LogoutButton;