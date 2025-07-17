import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IForm } from '../types/form/IForm';

export const FormCard: FC<{ form: IForm }> = ({ form }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{form.name}</Text>
      <Text style={styles.description}>{form.description}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{form.id}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Area ID:</Text>
        <Text style={styles.value}>{form.area_id}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Published:</Text>
        <Text style={[styles.value, form.publish ? styles.published : styles.unpublished]}>
          {form.publish ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Visible in App:</Text>
        <Text style={[styles.value, form.visible_app ? styles.published : styles.unpublished]}>
          {form.visible_app ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Created:</Text>
        <Text style={styles.value}>{new Date(form.created_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // for Android shadow
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#555',
    width: 120,
  },
  value: {
    color: '#333',
  },
  published: {
    color: 'green',
    fontWeight: '700',
  },
  unpublished: {
    color: 'red',
    fontWeight: '700',
  },
});
