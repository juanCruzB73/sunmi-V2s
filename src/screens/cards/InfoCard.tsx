import React, { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../router/StackNavigator';
import { IClaim } from '../../types/claims/IClaim';
import { IAnswer } from '../../types/claims/IAnswer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { onSetActiveClaim } from '../../redux/slices/claims/claimSlice';


interface ICardProps {
  claim: IClaim;
}

const InfoCard: FC<ICardProps> = ({ claim }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch = useDispatch<AppDispatch>();

  /*const handlePrint = async () => {
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
        Alert.alert('Print Successful', 'Print Successful', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Vuelve a InfoCard después de imprimir
          },
        ]);
      } catch (err) {
        let errorMessage = 'Failed to print';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        Alert.alert('Error', errorMessage, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Vuelve a InfoCard si falla
          },
        ]);
      }
  }, 300);
  }*/
  return (
    <TouchableOpacity style={claim.isSynced ? styles.container : styles.containerNotSync} onPress={()=>{dispatch(onSetActiveClaim(claim));navigation.navigate('ClaimScreen')}}>
      <View style={styles.infoContainer}>
        <Text>ID: {claim.id}</Text>
        <Text>Date: {claim.date}</Text>
        <Text>Synced: {claim.isSynced ? 'Yes' : 'No'}</Text>
        {claim.answers.map((answer:IAnswer) => (
          <View key={answer.id}>
            <Text>{answer.question.name}: {answer.input_string}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.printButton} onPress={()=>console.log("print function")}>
        <FontAwesome name="print" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  infoContainer: {},
  container: {
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "#59C5AA",
    margin: 15,
    borderRadius: 15,
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
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InfoCard;