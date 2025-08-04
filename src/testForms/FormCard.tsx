import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IForm } from '../types/form/IForm';

export const FormCard: FC<{ form: IForm }> = ({ form }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{form.name}</Text>
      <Text style={styles.description}>{form.description}</Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{form.id}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Área:</Text>
        <Text style={styles.value}>{form.area_id}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Publicado:</Text>
        <Text style={[styles.value, form.publish ? styles.published : styles.unpublished]}>
          {form.publish ? 'Sí' : 'No'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Visible en App:</Text>
        <Text style={[styles.value, form.visible_app ? styles.published : styles.unpublished]}>
          {form.visible_app ? 'Sí' : 'No'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Creado:</Text>
        <Text style={styles.value}>{new Date(form.created_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#34495e',
    width: 140,
  },
  value: {
    color: '#2c3e50',
    fontSize: 15,
  },
  published: {
    color: '#27ae60',
    fontWeight: '700',
  },
  unpublished: {
    color: '#c0392b',
    fontWeight: '700',
  },
});