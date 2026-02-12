import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { AuthScreen } from './src/screens/AuthScreen';
import { TasksScreen } from './src/screens/TasksScreen';

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight ?? 0 }}>
      {token ? <TasksScreen token={token} onLogout={() => setToken(null)} /> : <AuthScreen onAuthed={setToken} />}
    </SafeAreaView>
  );
}
