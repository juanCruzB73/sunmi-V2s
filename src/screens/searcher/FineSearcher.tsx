import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { TopBar } from "../../components/top-bar/TopBar";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState } from "react";
import InfoCard from "../cards/InfoCard";

export interface ICardInfo {
    nroMulta: number,
    type: "Automovil" | "Multa",
    plateOrRut: string,
    status:"synced"|"unsynced"
}

const cardInfoInitialState: ICardInfo[] = [
    {
        nroMulta: 1001,
        type: "Automovil",
        plateOrRut: "ABC123",
        status:"synced"
    },
    {
        nroMulta: 1002,
        type: "Multa",
        plateOrRut: "12.345.678-9",
        status:"synced"
    },
    {
        nroMulta: 1003,
        type: "Automovil",
        plateOrRut: "XYZ789",
        status:"unsynced"
    },
    {
        nroMulta: 1004,
        type: "Multa",
        plateOrRut: "98.765.432-1",
        status:"unsynced"
    },
    {
        nroMulta: 1005,
        type: "Automovil",
        plateOrRut: "DEF456",
        status:"unsynced"
    },
    {
        nroMulta: 1006,
        type: "Multa",
        plateOrRut: "11.222.333-4",
        status:"synced"
    },
    {
        nroMulta: 1007,
        type: "Automovil",
        plateOrRut: "GHI789",
        status:"unsynced"
    }
];

const FineSearcher = () => {
    const [searchInputs,setSearchInput]=useState("");
    const handleInput=(value:string)=>{
        setSearchInput(value);
    }
    return (
      <>
          <TopBar/>
          <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.searchContainer}>
                    <FontAwesome 
                      name="search" 
                      style={styles.searchIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder={"Rut o Matricula"}
                      value={searchInputs}
                      onChangeText={setSearchInput}
                      autoCorrect={false}
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                    />
                    {searchInputs.length > 0 && (
                      <TouchableOpacity style={styles.clearButton}>
                        <FontAwesome 
                          name="times-circle"  
                        />
                      </TouchableOpacity>
                    )}
              </View>
              <FlatList
                  style={styles.listFines}
                  data={cardInfoInitialState}
                  keyExtractor={(item) => item.nroMulta.toString()}
                  renderItem={({ item }) => (
                      <InfoCard item={item}/>
                  )}
              />
          </ScrollView>
      </>
    )
}
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width:width * 0.9,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  listFines:{
    display:"flex",
  }
});
export default FineSearcher
