import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { TaskCard } from '../src/components/TaskCard';

export default function ListScreen() {
  const { tasks, theme, toggleTask } = useApp();
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() =>
              router.push({ pathname: '/task/[id]', params: { id: item.id } })
            }
            onToggle={() => toggleTask(item.id)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, theme === 'dark' && styles.lightText]}>
              Campus Planner
            </Text>
            <Text style={[styles.stats, theme === 'dark' && styles.lightSubtext]}>
              Всего: {tasks.length} · Выполнено: {completedCount}
            </Text>
            <View style={styles.actions}>
              <Pressable
                style={styles.addBtn}
                onPress={() => router.push('/task/new')}
              >
                <Text style={styles.addText}>+ Новая задача</Text>
              </Pressable>
              <Pressable
                style={styles.settingsBtn}
                onPress={() => router.push('/settings')}
              >
                <Text style={styles.settingsText}>Настройки</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Список пока пуст</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  darkBg: { backgroundColor: '#121212' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#1565c0' },
  lightText: { color: '#90caf9' },
  stats: { marginTop: 4, fontSize: 14, color: '#616161' },
  lightSubtext: { color: '#b0b0b0' },
  actions: { flexDirection: 'row', marginTop: 12, gap: 8 },
  addBtn: { flex: 1, backgroundColor: '#2e7d32', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  settingsBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#1565c0', alignItems: 'center' },
  settingsText: { color: '#1565c0', fontWeight: '600' },
  empty: { paddingTop: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#9e9e9e' },
});