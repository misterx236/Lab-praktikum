import React, { useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import Screen from '../src/components/ui/Screen';
import AppButton from '../src/components/ui/AppButton';
import AppInput from '../src/components/ui/AppInput';
import EmptyState from '../src/components/ui/EmptyState';
import ProgressBar from '../src/components/ui/ProgressBar';
import TaskCard from '../src/components/task/TaskCard';
import { useTasks } from '../src/hooks/useTasks';
import { useTheme } from '../src/hooks/useTheme';
import {
  filterTasks,
  getTaskStats,
  sortByPriority,
} from '../src/utils/task';
import { spacing } from '../src/theme/spacing';

export default function IndexScreen() {
  const { tasks, toggleTaskStatus, removeTask } = useTasks();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const visible = useMemo(
    () => sortByPriority(filterTasks(tasks, query)),
    [tasks, query]
  );

  // Определяем id только что созданной задачи для анимации появления
  const prevIdsRef = useRef<Set<string> | null>(null);
  const newestIdRef = useRef<string | null>(null);

  const currentIds = new Set(tasks.map((t) => t.id));

  if (prevIdsRef.current === null) {
    // Первый рендер — запоминаем стартовое состояние
    prevIdsRef.current = currentIds;
  } else {
    for (const id of currentIds) {
      if (!prevIdsRef.current.has(id)) {
        newestIdRef.current = id;
        break;
      }
    }
    prevIdsRef.current = currentIds;
  }

  return (
    <Screen padded>
      <View style={styles.header}>
        <Text style={[styles.stats, { color: colors.secondaryText }]}>
          Всего: {stats.total} · Активных: {stats.active} · Выполнено:{' '}
          {stats.completed}
        </Text>

        <ProgressBar completed={stats.completed} total={stats.total} />

        <View style={styles.headerButtons}>
          <AppButton
            title="+ Добавить"
            onPress={() => router.push('/task/new')}
            fullWidth={false}
            style={styles.addButton}
          />
          <AppButton
            title="⚙ Настройки"
            variant="secondary"
            onPress={() => router.push('/settings')}
            fullWidth={false}
          />
        </View>

        <AppInput
          placeholder="Поиск по названию или предмету"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutUp.duration(200)}
            layout={Layout.springify().damping(14)}
          >
            <TaskCard
              task={item}
              isNew={item.id === newestIdRef.current}
              onPress={(id) =>
                router.push({ pathname: '/task/[id]', params: { id } })
              }
              onToggle={toggleTaskStatus}
              onDelete={removeTask}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          query.trim() ? (
            <EmptyState
              icon="🔍"
              title="Ничего не найдено"
              description="Попробуйте изменить запрос"
            />
          ) : (
            <EmptyState
              icon="📚"
              title="Список пока пуст"
              description="Добавьте первую задачу"
              action={
                <AppButton
                  title="Создать задачу"
                  onPress={() => router.push('/task/new')}
                  fullWidth={false}
                />
              }
            />
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: spacing.sm },
  stats: { fontSize: 14, marginBottom: spacing.sm },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  addButton: { flexGrow: 1 },
  list: { paddingBottom: spacing.lg },
});