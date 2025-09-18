import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  View,
  FlatList,
  Text,
  Dimensions,
  ActivityIndicator,
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
import { ClaimType } from "../../redux/slices/claims/claimSlice";
import { unSyncedClaim } from "../../types/unSyncedClaim";
import { searchClaim } from "../../utlis/searchClaim";
import { IClaim } from "../../types/claims/IClaim";

type Props = NativeStackScreenProps<RootStackParamList, "ClaimSearcher">;

const ClaimSearcher = ({ navigation }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredClaims, setFilteredClaims] = useState<ClaimType[]>([]);
  const [loading, setLoading] = useState(false);
  const { claims } = useSelector((state: RootState) => state.claim);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setFilteredClaims(claims);
  }, [claims]);

  const handleSyncClaims = async () => {
    setLoading(true);
    await dispatch(uploadUnsyncedClaims());
    setLoading(false);
  };

  const handleSearch=(keyword:string)=>{
    const claimsFound=searchClaim(claims,keyword);
    setFilteredClaims(claimsFound);
  }
  

  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={["#f1f5fa", "#d8e4f4"]} style={styles.gradient}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.searchContainer}>
              <FontAwesome name="search" size={20} color="#555" style={styles.searchIcon} />
              <TextInput
                style={styles.input}
                placeholder="Buscar Reclamo"
                value={searchInput}
                onChangeText={(text) => {
                  setSearchInput(text);
                  handleSearch(text);
                }}
                keyboardType="default"
                autoCorrect={false}
                autoCapitalize="characters"
                placeholderTextColor="#999"
              />
              {searchInput.length > 0 && (
                <Pressable
                  onPress={() => {
                    handleSearch(searchInput)
                  }}
                  style={styles.clearButton}
                >
                  <FontAwesome name="times-circle" size={20} color="#999" />
                </Pressable>
              )}
            </View>
          }
          data={filteredClaims}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <InfoCard claim={item} onSync={handleSyncClaims} />
          )}
          contentContainerStyle={styles.listContainer}
        />

        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#ff0000ff" />
            <Text style={styles.loadingText}>Subiendo reclamos...</Text>
          </View>
        )}
      </LinearGradient>
    </>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
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
  listContainer: {
    padding: 20,
    paddingBottom: 60,
    gap: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ClaimSearcher;