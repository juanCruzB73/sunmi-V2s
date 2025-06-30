import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import EmailInput from '../../components/forgotPassword/EmailInput';
import LoginButton from '../../components/login/LoginButton';

const ForgetPasswordScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>('');

  const handleSend = () => {
    if (!email.trim()) {
      Alert.alert('Correo vacío', 'Por favor ingresá tu correo electrónico.');
      return;
    }

    Alert.alert('Recuperar contraseña', `Se enviará un correo a: ${email}`);
  };
//A IMPLEMENTAR
  const handleBack = () => {
    navigation.goBack();
  };

  return (
  <View style={styles.container}>
    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
      <Text style={styles.backButtonText}>← Volver</Text>
    </TouchableOpacity>
    <Text style={styles.title}>¿Olvidó su contraseña?</Text>
    <Text style={styles.description}>
      Ingrese su email para recuperar su contraseña
    </Text>

    <EmailInput value={email} onChangeText={setEmail} />
    <LoginButton label="Enviarr" onPress={handleSend} />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 50,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    padding: 8,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 60, // Para que no tape el botón de volver
  },
  description: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 44,
    color: '#333',
  },
});

export default ForgetPasswordScreen;