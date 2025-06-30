import { View, Image, StyleSheet, Alert, Text, TouchableOpacity, Dimensions,TextInput  } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import { useState } from 'react';

export const VehicleSearcher = () => {
    const [plateNumber,setPlateNumber]=useState('');
    const handlePlateChange = (text:string) => {
        // Allow only letters and numbers, remove other characters
        const filteredText = text.replace(/[^a-zA-Z0-9]/g, '');
        setPlateNumber(filteredText);
    };
    return (
      <>
          <TopBar/>
          <View style={styles.VehicleSearcherContainer}>
              <View style={styles.VehicleSearcherContainer}>
                  <Text style={styles.title}>Ingrese la patente del vehiculo</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handlePlateChange}
                    value={plateNumber}
                    placeholder="Enter plate"
                    keyboardType="default"
                />
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.vehicleSearchButton}>Buscar</Text>
              </TouchableOpacity>
              </View>
          </View>
          </>
    )
}
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    input:{
        height: 50,     
        fontSize: 18,     
        paddingHorizontal: 10,
        borderColor: '#ccc',
        backgroundColor:"white",
        borderWidth: 1,
        borderRadius: 8,
        maxHeight:height * 0.9
    },
    title:{},
    VehicleSearcherContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        flex: 2,
        padding: 10,
        alignSelf: 'stretch',
        maxHeight:height * 0.4
    },
    button:{},
    vehicleSearchButton:{
        backgroundColor:"#1664C0",
        padding:15,
        textAlign:"center",
        borderRadius: 15,
        borderWidth: 0,
        color: "white"
    }
});
