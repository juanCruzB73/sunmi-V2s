import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
interface EmailInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChangeText, ...rest }) => (
  <View style={styles.inputContainer}>
    <FontAwesome name="envelope" size={20} color="#888" style={styles.icon} />
    <TextInput
      style={styles.input}
      placeholder="Ingrese su correo electrónico"
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      keyboardType="email-address"
      autoCapitalize="none"
      {...rest}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 24,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export default EmailInput;