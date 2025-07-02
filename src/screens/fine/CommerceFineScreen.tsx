import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TopBar } from '../../components/top-bar/TopBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import React from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceFineScreen'>;

const CommerceFineScreen = ({ navigation }: Props) => {
  return (
    <>
      <TopBar navigation={navigation} />
      <View style={styles.VehicleFineContainer}>
        <Text style={styles.title}>Confirmar datos del Comercio</Text>
        <View style={styles.container}>
          <View style={styles.textFieldsContainer}>
            <Text style={styles.plate}>asdw0000</Text>
            <Text style={styles.textField}>Registro comercial:</Text>
            <Text style={styles.textField}>Tipo de comercio: </Text>
            <Text style={styles.textField}>Comuna: </Text>
            <Text style={styles.textField}>Calle: </Text>
            <Text style={styles.textField}>Numeración: </Text>
            <Text style={styles.textField}>Licencia de comercio: </Text>
            <Text style={styles.textField}>Infracciones anteriores: </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonGoBack}
              onPress={() => navigation.navigate('CommerceSearcher')}
            >
              <Text style={styles.text}>Volver</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('FineSearcher')}
            >
              <Text style={styles.text}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    alignSelf: "baseline"
  },
  VehicleFineContainer: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    width: width,
    maxHeight: height * 0.9,
  },
  container: {
    minHeight: height * 0.7,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
  plate: {
    fontSize: 40
  },
  textFieldsContainer: {
    backgroundColor: "#F2F3F2",
    padding: 20,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "baseline",
    width: width * 0.9,
    borderRadius: 15,
    height: height * 0.5,
  },
  textField: {
    fontSize: 20
  },
  buttonContainer: {
    display: "flex",
    width: width,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  buttonGoBack: {
    backgroundColor: '#ff0000',
    width: width * 0.4,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    width: width * 0.4,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    color: "white",
    fontSize: 20
  },
});

export default CommerceFineScreen;