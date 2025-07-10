import React from 'react';
import {
  Modal,
  View,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

type Props = {
  visible: boolean;
  options: string[];
  onSelect: (value: string) => void;
  onCancel: () => void;
};

const SelectModal = ({ visible, options, onSelect, onCancel }: Props) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.content}>
        <FlatList
          data={options}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Pressable style={styles.item} onPress={() => onSelect(item)}>
              <Text style={styles.itemText}>{item}</Text>
            </Pressable>
          )}
        />
        <Pressable style={styles.cancel} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  cancel: {
    marginTop: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SelectModal;