import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../router/StackNavigator';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { onLogOut } from '../../redux/slices/authSlice';

const { width } = Dimensions.get('window');

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    dispatch(onLogOut())
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Cerrar sesion</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: width * 0.8,
    marginTop: 30,
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