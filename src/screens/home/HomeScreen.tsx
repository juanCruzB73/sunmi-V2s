import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View,Text,StyleSheet, Dimensions, Alert } from 'react-native'
import { TopBar } from '../../components/top-bar/TopBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator' // adjust path if needed
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { RootState } from '@reduxjs/toolkit/query';
import { onLogin, onLogOut } from '../../redux/slices/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {

    const dispatch = useDispatch<AppDispatch>();
    const {user,status} = useSelector((state: RootState) => state.auth);
    
   const handleTest=()=>{
    if(status=="authenticated"){
        dispatch(onLogOut())
    }else{
        dispatch(onLogin({userId:1,email:"asdw@gmail.com",password:"asdw"}))
    }
   }

    return (
      <>
          <TopBar navigation={navigation}/>
          <Text>Status: {status}</Text>
          <Text>email: {user.email}</Text>
          <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VehicleScreen')}>
                  <Text style={styles.text}>Automoviles</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CommerceMenu')}>
                  <Text style={styles.text}>Comercio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FineSearcher')}>
                  <Text style={styles.text}>Multas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleTest()}>
                  <Text style={styles.text}>Otros</Text>
              </TouchableOpacity>
          </View>
      </>
    )
}

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


const styles=StyleSheet.create({
    container:{
        display:"flex",
        justifyContent:"space-around",
        width:width,
        alignItems:"center",
        height:height * 0.8
    },
    button:{
        backgroundColor: '#007bff',
        width:width * 0.8,
        padding: 25,
        borderRadius: 8,
        alignItems: 'center',
    },
    text:{
        color:"white",
        fontSize:20
    },
})
export default HomeScreen
