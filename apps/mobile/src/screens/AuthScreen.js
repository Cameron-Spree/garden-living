import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../api';

export function AuthScreen({ onAuthed }) {
  const [email, setEmail] = useState('demo@garden.app');
  const [password, setPassword] = useState('password123');
  const [handle, setHandle] = useState('plantfriend');
  const [displayName, setDisplayName] = useState('Plant Friend');
  const [error, setError] = useState(null);

  const register = async () => {
    try {
      setError(null);
      const response = await api.register({ email, password, handle, displayName });
      onAuthed(response.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const login = async () => {
    try {
      setError(null);
      const response = await api.login({ email, password });
      onAuthed(response.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garden Living</Text>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Handle" value={handle} onChangeText={setHandle} />
      <TextInput style={styles.input} placeholder="Display Name" value={displayName} onChangeText={setDisplayName} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.row}>
        <Button title="Register" onPress={register} />
        <Button title="Login" onPress={login} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8, padding: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  error: { color: 'red' }
});
