import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import { createApiClient } from '@repo/api-client';
import type { User } from '@repo/types';

const api = createApiClient(
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000'
);

export default function HomeScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.users.getAll().then(setUsers);
  }, []);

  const handleCreate = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await api.users.create({ name, email });
      setName('');
      setEmail('');
      const updated = await api.users.getAll();
      setUsers(updated);
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button 
        title={loading ? "Creating..." : "Add User"} 
        onPress={handleCreate}
        disabled={loading}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  list: {
    marginTop: 20,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
});
