import React from 'react'
import { TouchableOpacity, View,Text,StyleSheet, Dimensions } from 'react-native'
import { TopBar } from '../../components/top-bar/TopBar'

const HomeScreen = () => {

    const onPress=()=>{}
  return (
    <>
        <TopBar/>
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.text}>Automoviles</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.text}>Comercio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.text}>Documentos Generados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onPress}>
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
