import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../api';

interface Props {
  onAuthed: (token: string) => void;
}

export function AuthScreen({ onAuthed }: Props) {
  const [email, setEmail] = useState('demo@garden.app');
  const [password, setPassword] = useState('password123');
  const [handle, setHandle] = useState('plantfriend');
  const [displayName, setDisplayName] = useState('Plant Friend');
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    try {
      setError(null);
      const res = await api.register({ email, password, handle, displayName });
      onAuthed(res.token);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const login = async () => {
    try {
      setError(null);
      const res = await api.login({ email, password });
      onAuthed(res.token);
    } catch (err) {
      setError((err as Error).message);
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
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  error: { color: 'red' }
});
