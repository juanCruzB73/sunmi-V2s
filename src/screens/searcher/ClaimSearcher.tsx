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
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { triggerSync } from "../../sync/syncManager";
import { getDBConnection, createTables } from "../../localDB/db";
import { SQLiteDatabase } from "react-native-sqlite-storage";

type Props = NativeStackScreenProps<RootStackParamList, "ClaimSearcher">;

const ClaimSearcher = ({ navigation }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const { claims } = useSelector((state: RootState) => state.claim);

  // 🧠 Sincroniza reclamos
  const handleSyncPress = async () => {
    try {
      const db = await getDBConnection();
      await createTables(db);
      await triggerSync(db);
      console.log("📦 Reclamos en Redux:", claims.length, claims.map(c => c.id));
    } catch (error) {
      console.error("⛔ Error preparando la DB:", error);
    }
  };

  // 🧹 Elimina un claim puntual de SQLite por ID
  const forceDeleteClaimById = async (db: SQLiteDatabase, claimId: number): Promise<void> => {
    try {
      await db.executeSql("DELETE FROM claims WHERE id = ?", [claimId]);
      console.log(`🧹 Claim #${claimId} eliminado manualmente de la base`);
    } catch (error) {
      console.error(`⛔ Error al eliminar claim #${claimId}:`, error);
    }
  };

  // 🧹 Ejecuta eliminación desde botón
  const handleDeletePress = async () => {
    const db = await getDBConnection();
    await forceDeleteClaimById(db, 1753197552466); // ⬅️ ajustá el ID según el que estés testeando
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

          {/* 🔄 Botón para sincronizar manualmente */}
          <Pressable onPress={handleSyncPress} style={styles.syncButton}>
            <FontAwesome name="upload" size={16} color="#fff" />
            <Text style={styles.syncText}>Subir reclamos a la API</Text>
          </Pressable>

          {/* 🧹 Botón de eliminación puntual por ID */}
          <Pressable onPress={handleDeletePress} style={styles.deleteButton}>
            <FontAwesome name="trash" size={16} color="#fff" />
            <Text style={styles.syncText}>Borrar claim puntual</Text>
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
  },
  list: {
    gap: 12,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: "flex-end",
    gap: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: "flex-end",
    gap: 8,
  },
  syncText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ClaimSearcher;