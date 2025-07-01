
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { TopBar } from '../../components/top-bar/TopBar'

const VehicleFineScreen = () => {
  return (
    <>
        <TopBar/>
        <View style={styles.VehicleFineContainer}>
            <Text style={styles.title}>Buscador de Comercios</Text>
            <View style={styles.container}>
              <Text style={styles.plate}>asdw0000</Text>
              <View style={styles.textFieldsContainer}>
                <Text style={styles.textField}> travis blicke</Text>
              </View>
              
            </View>
        </View>
    </>
  )
}
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  title:{
    fontSize:20,
    alignSelf:"baseline"
  },
  VehicleFineContainer:{
    padding:20,
    display:"flex",
    justifyContent:"center",
    alignContent:"center",
    width:width,
    height:height * 0.8,
  },
  container:{
    height:height * 0.7,
    display:"flex",
    justifyContent:"space-around",
    alignItems:"center"
  },
  plate:{
    fontSize:50
  },
  textFieldsContainer:{
    padding:20,
    display:"flex",
    alignItems:"baseline",
    width:width,
    height:height,
  },
  textField:{
    fontSize:20
  }
});

export default VehicleFineScreen
