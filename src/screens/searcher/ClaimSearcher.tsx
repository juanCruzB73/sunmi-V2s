import React, { useState, useEffect, act } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  View,
  FlatList,
  Text,
  Dimensions,
} from "react-native";
import { TopBar } from "../../components/top-bar/TopBar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import InfoCard from "../cards/InfoCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../router/StackNavigator";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


type Props = NativeStackScreenProps<RootStackParamList, "ClaimSearcher">;

const ClaimSearcher = ({ navigation }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const { claims, isModified } = useSelector((state: RootState) => state.claim);
  const [showFloatingMessage, setShowFloatingMessage] = useState(false); // ✅ NUEVO

  // ✅ Mostrar mensaje al volver de edición
  useEffect(() => {
    console.log("isModified:", isModified);
    if (isModified) {

      setShowFloatingMessage(true);
      const timer = setTimeout(() => setShowFloatingMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isModified]);

  return (
    <>
      {showFloatingMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Modificación exitosa ✅</Text>
        </View>
      )}

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

          <FlatList
            data={claims.filter((item) => item && item.id != null)}
            keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) =>
              item ? <InfoCard claim={item} /> : null
            }
          />
        </View>
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
  toast: {
    position: 'absolute',
    top: 20,
    left: width / 2 - 150,
    width: 300,
    backgroundColor: '#323232',
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ClaimSearcher;