import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { startLogOut } from '../../redux/slices/authThunk';
const { width } = Dimensions.get('window');

const LogoutButton: React.FC = () => {
  
  const dispatch = useDispatch<AppDispatch>();

  const handleLogOut=()=>{
       dispatch(startLogOut())
    }

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogOut}>
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