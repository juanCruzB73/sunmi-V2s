import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './src/redux/store';
import StackNavigator from './src/router/StackNavigator';
import { restoreAuthState } from './src/redux/slices/auth/authThunk';
import { createTables, getDBConnection } from './src/localDB/db';

export const Main = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth); // 'checking' | 'authenticated' | 'not-authenticated'

  useEffect(() => {
    dispatch(restoreAuthState());
  }, [dispatch]);

  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await getDBConnection();
        await createTables(db);
        console.log('Database initialized');
      } catch (e) {
        console.error('DB init failed', e);
      }
    };

    initDB();
  }, []);

  return <StackNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fbfd',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#34495e',
  },
});