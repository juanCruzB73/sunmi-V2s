import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
  placeholder?: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, secureTextEntry, value, onChangeText }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#888"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default InputField;