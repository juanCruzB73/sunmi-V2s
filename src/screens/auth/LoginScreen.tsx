import React, { useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
import InputField from '../../components/login/InputField';
import LoginButton from '../../components/login/LoginButton';
import ForgetPassword from '../../components/login/ForgetPassword';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { startOnLogIn } from '../../redux/slices/auth/authThunk';
import { AppDispatch, RootState } from '../../redux/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('fcasteller@gmail.com');
  const [password, setPassword] = useState('2668765');
  const [errorMessage, setErrorMessage] = useState('');
  const { status } = useSelector((state: RootState) => state.auth);


  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const success = await dispatch(startOnLogIn({ email, password }));

      if (!success) {
        setErrorMessage('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      const message = (err as Error).message || 'Ha ocurrido un error inesperado';
      setErrorMessage(message);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/rlinklogo.png')} style={styles.logo} />
      </View>

      <InputField placeholder="Usuario" value={email} onChangeText={setEmail} />
      <InputField placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

      
        <LoginButton label="Ingresar" onPress={handleLogin} />

      <ForgetPassword onPress={handleForgotPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 35,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 800,
    height: 100,
    resizeMode: 'contain',
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;