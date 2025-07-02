import React, { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../router/StackNavigator';

interface IItem {
  nroMulta: number,
  type: "Automovil" | "Multa",
  plateOrRut: string,
  status: "synced" | "unsynced"
}

interface ICardInfoInitialState {
  item: IItem
}

const InfoCard: FC<ICardInfoInitialState> = ({ item }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePrint = async () => {
    navigation.navigate('Printing');
    setTimeout(async () => {
      try {
        await SunmiPrinterLibrary.prepare();
        await SunmiPrinterLibrary.printText('OFFICIAL TICKET\n');
        await SunmiPrinterLibrary.printText('----------------\n');
        await SunmiPrinterLibrary.printText(`Document #: ${item.nroMulta}\n`);
        await SunmiPrinterLibrary.printText(`Type: ${item.type}\n`);
        if (item.type === "Automovil") {
          await SunmiPrinterLibrary.printText(`License Plate: ${item.plateOrRut}\n`);
        } else {
          await SunmiPrinterLibrary.printText(`RUT: ${item.plateOrRut}\n`);
        }
        await SunmiPrinterLibrary.printText(`Status: `);
        await SunmiPrinterLibrary.printText(`${item.status.toUpperCase()}\n`);
        await SunmiPrinterLibrary.printText('----------------\n');
        await SunmiPrinterLibrary.printText('Thank you\n\n\n');
        Alert.alert('Print Successful', 'Print Successful');
      } catch (err) {
        let errorMessage = 'Failed to print';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        Alert.alert('Error', errorMessage, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Vuelve a InfoCard
          },
        ]);
      }
    }, 300);
  }

  return (
    <View style={item.status == "synced" ? styles.container : styles.containerNotSync} >
      <View style={styles.infoContainer}>
        <Text>Number: {item.nroMulta}</Text>
        <Text>Type: {item.type}</Text>
        <Text>Plate/RUT: {item.plateOrRut}</Text>
      </View>
      <TouchableOpacity
        style={styles.printButton}
        onPress={handlePrint}
      >
        <FontAwesome name="print" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {

  },
  container: {
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "#59C5AA",
    margin: 15,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: 'transparent',
  },
  containerNotSync: {
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "#E66180",
    margin: 15,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: 'transparent',
  },
  printButton: {
    backgroundColor: '#3498db',
    borderRadius: 6,
    marginLeft: 10,
    minWidth: 50,
    maxHeight: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default InfoCard;