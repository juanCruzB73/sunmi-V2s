import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TextInput,
  Pressable,
  View,
  FlatList,
  ScrollView
} from "react-native";
import { TopBar } from "../../components/top-bar/TopBar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import InfoCard from "../cards/InfoCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../router/StackNavigator";
import LinearGradient from "react-native-linear-gradient";

export interface ICardInfo {
  nroMulta: number;
  type: "Automovil" | "Multa";
  plateOrRut: string;
  status: "synced" | "unsynced";
}

type Props = NativeStackScreenProps<RootStackParamList, "FineSearcher">;

const cardInfoInitialState: ICardInfo[] = [
  { nroMulta: 1001, type: "Automovil", plateOrRut: "ABC123", status: "synced" },
  { nroMulta: 1002, type: "Multa", plateOrRut: "12.345.678-9", status: "synced" },
  { nroMulta: 1003, type: "Automovil", plateOrRut: "XYZ789", status: "unsynced" },
  { nroMulta: 1004, type: "Multa", plateOrRut: "98.765.432-1", status: "unsynced" },
  { nroMulta: 1005, type: "Automovil", plateOrRut: "DEF456", status: "unsynced" },
  { nroMulta: 1006, type: "Multa", plateOrRut: "11.222.333-4", status: "synced" },
  { nroMulta: 1007, type: "Automovil", plateOrRut: "GHI789", status: "unsynced" },
];

const FineSearcher = ({ navigation }: Props) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={["#f1f5fa", "#d8e4f4"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#555" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Buscar por RUT o Patente"
              value={searchInput}
              onChangeText={setSearchInput}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            {searchInput.length > 0 && (
              <Pressable onPress={() => setSearchInput("")} style={styles.clearButton}>
                <FontAwesome name="times-circle" size={20} color="#999" />
              </Pressable>
            )}
          </View>

          <FlatList
            data={cardInfoInitialState}
            keyExtractor={(item) => item.nroMulta.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <InfoCard item={item} />}
          />
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    paddingLeft: 8,
  },
  list: {
    gap: 12,
  },
});

export default FineSearcher;