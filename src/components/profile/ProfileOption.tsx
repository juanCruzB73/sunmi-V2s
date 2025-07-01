import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface ProfileOptionProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <FontAwesome name={icon} size={20} color="#333" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <FontAwesome name="angle-right" size={20} color="#999" />
    </TouchableOpacity>
  );
};
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth:width,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});

export default ProfileOption;