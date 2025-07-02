import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Props {
  visible: boolean;
}

const SaveSuccesSnackbar: React.FC<Props> = ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.snackbar}>
      <Text style={styles.text}>Save Success! ✅ (Check Cards)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#323232',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SaveSuccesSnackbar;