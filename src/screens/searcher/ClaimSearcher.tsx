import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  View,
  FlatList,
  Text,
  
} from "react-native";
import { TopBar } from "../../components/top-bar/TopBar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import InfoCard from "../cards/InfoCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../router/StackNavigator";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { uploadUnsyncedClaims } from "../../redux/slices/claims/claimThunk";


type Props = NativeStackScreenProps<RootStackParamList, "ClaimSearcher">;

const ClaimSearcher = ({ navigation }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const { claims } = useSelector((state: RootState) => state.claim);

  const dispatch = useDispatch<AppDispatch>();

  const handleSyncClaims=()=>{
    dispatch(uploadUnsyncedClaims());
  };
 
  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={["#f1f5fa", "#d8e4f4"]} style={styles.gradient}>
        <View style={styles.container}>
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
            <Pressable onPress={() => handleSyncClaims()} style={styles.clearButton}>
                <Text>Subir reclamos</Text>
              </Pressable>
          <FlatList
            data={claims}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <InfoCard claim={item} />}
          />
        </View>
      </LinearGradient>
    </>
  );
};


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
    color:"#999"
  },
  list: {
    gap: 12,
  },
});

export default ClaimSearcher;