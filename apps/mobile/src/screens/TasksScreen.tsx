import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../api';
import { Streak, Task } from '../types';

interface Props {
  token: string;
  onLogout: () => void;
}

export function TasksScreen({ token, onLogout }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('Water Monstera');
  const [streak, setStreak] = useState<Streak>({ currentStreakDays: 0, actionsThisWeek: 0 });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const [taskData, streakData] = await Promise.all([api.listTodayTasks(token), api.getStreak(token)]);
      setTasks(taskData);
      setStreak(streakData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const addTask = async () => {
    try {
      const dueAt = new Date().toISOString();
      await api.createTask(token, { title, taskType: 'water', dueAt });
      setTitle('');
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const result = await api.completeTask(token, taskId);
      setStreak(result.streak);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Today&apos;s Tasks</Text>
        <Button title="Logout" onPress={onLogout} />
      </View>
      <Text style={styles.streak}>Streak: {streak.currentStreakDays} days · {streak.actionsThisWeek}/7 actions</Text>
      <TextInput style={styles.input} placeholder="New task title" value={title} onChangeText={setTitle} />
      <Button title="Add Task" onPress={addTask} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <View>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text>{item.taskType} · {new Date(item.dueAt).toLocaleTimeString()}</Text>
            </View>
            <Button title={item.status === 'done' ? 'Done' : 'Complete'} disabled={item.status === 'done'} onPress={() => completeTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '700' },
  streak: { fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8, padding: 10 },
  taskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  taskTitle: { fontWeight: '600' },
  error: { color: 'red' }
});
