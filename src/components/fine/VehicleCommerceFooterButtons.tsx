import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onCancel: () => void;
  onClear: () => void;
  onSave: () => void;
}

const VehicleCommerceFooterButtons: React.FC<Props> = ({ onCancel, onClear, onSave }) => (
  <View style={styles.container}>
    <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
      <Text style={styles.text}>Eliminar</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.button, styles.clear]} onPress={onClear}>
      <Text style={styles.text}>Limpiar</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.button, styles.save]} onPress={onSave}>
      <Text style={styles.text}>Guardar</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#ff0000',
  },
  clear: {
    backgroundColor: '#ccc',
  },
  save: {
    backgroundColor: '#004d9a',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default VehicleCommerceFooterButtons;