import React, { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library';
import { Alert } from 'react-native';

interface IItem
  {
    nroMulta: number,
    type: "Automovil" | "Multa",
    plateOrRut: string,
    status:"synced"|"unsynced"
}


interface ICardInfoInitialState {
    item:IItem
}

const InfoCard:FC<ICardInfoInitialState> = ({item}) => {

  const handlePrint=async()=>{

    try {
        // Prepare the printer
        await SunmiPrinterLibrary.prepare();
      
        // Print header
        //await SunmiPrinterLibrary.setAlignment(1); // Center alignment
        await SunmiPrinterLibrary.printText('OFFICIAL TICKET\n');
        await SunmiPrinterLibrary.printText('----------------\n');
        //await SunmiPrinterLibrary.setAlignment(0); // Left alignment
      
        // Print document details
        await SunmiPrinterLibrary.printText(`Document #: ${item.nroMulta}\n`);
        await SunmiPrinterLibrary.printText(`Type: ${item.type}\n`);
        
        // Print either plate or RUT based on type
        if (item.type === "Automovil") {
          await SunmiPrinterLibrary.printText(`License Plate: ${item.plateOrRut}\n`);
        } else {
          await SunmiPrinterLibrary.printText(`RUT: ${item.plateOrRut}\n`);
        }
      
        // Print status with emphasis
        await SunmiPrinterLibrary.printText(`Status: `);
        //await SunmiPrinterLibrary.setEmphasized(true);
        await SunmiPrinterLibrary.printText(`${item.status.toUpperCase()}\n`);
        //await SunmiPrinterLibrary.setEmphasized(false);
      
        // Print footer
        //await SunmiPrinterLibrary.setAlignment(1); // Center alignment
        await SunmiPrinterLibrary.printText('----------------\n');
        await SunmiPrinterLibrary.printText('Thank you\n\n\n');
      
        // Cut paper (if supported)
        //await SunmiPrinterLibrary.cutPaper();
      
        Alert.alert('Success', 'Document printed successfully');
        } catch (err) {
          let errorMessage = 'Failed to print';
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          console.error(err);
          Alert.alert('Error', errorMessage);
        }
}

  return (
        <View style={item.status=="synced"?styles.container:styles.containerNotSync} >
          <View style={styles.infoContainer}>
            <Text>Number: {item.nroMulta}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Plate/RUT: {item.plateOrRut}</Text>
          </View>
          <TouchableOpacity
              style={styles.printButton}
              onPress={() => handlePrint()}
            >
            <FontAwesome name="print" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  infoContainer:{
    
  },
  container:{
    padding: 20, 
    borderBottomWidth: 1,
    backgroundColor:"#59C5AA",
    margin:15,
    borderRadius:15,
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    borderColor: 'transparent',
  },
  containerNotSync:{
    padding: 20, 
    borderBottomWidth: 1,
    backgroundColor:"#E66180",
    margin:15,
    borderRadius:15,
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    borderColor: 'transparent',
  },
  printButton:{
    backgroundColor: '#3498db',
    borderRadius: 6,
    marginLeft: 10,
    minWidth:50,
    maxHeight:50,
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }
});

export default InfoCard
